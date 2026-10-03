import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAdminDb, PG_UNIQUE_VIOLATION } from "@/lib/insforge-admin";
import type { OrderRow } from "@/db/types";
import { wompiFetch } from "@/lib/payments/wompi";
import { mapWompiError } from "@/lib/payments/errors-wompi";

interface WompiTransaction {
  id: string;
  status: string;
  reference: string;
  amount_in_cents: number;
  currency: string;
  payment_method_type?: string;
  status_message?: string;
}

interface WompiEvent {
  event: string;
  data: { transaction: WompiTransaction };
  environment: "test" | "prod";
  signature: { checksum: string; properties: string[] };
  timestamp: number;
  sent_at: string;
}

// verifyWompiChecksum() is called below before any event data is trusted.
export async function POST(request: Request) {
  // Guard against oversized payloads before parsing.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 256 * 1024) {
    return new NextResponse(null, { status: 413 });
  }

  const rawBody = await request.text();
  let event: WompiEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  // Verify the checksum before trusting anything in the payload.
  if (!verifyWompiChecksum(event, requireEventsSecret())) {
    return new NextResponse(null, { status: 400 });
  }

  // Reject events outside Wompi's recommended 10-minute tolerance window.
  const now = Math.floor(Date.now() / 1000);
  if (!event.timestamp || Math.abs(now - event.timestamp) > 600) {
    return new NextResponse(null, { status: 400 });
  }

  const db = getAdminDb();

  // Dedup — Wompi doesn't expose a standalone event id, so we compose one from the
  // transaction id + timestamp. TTL of 7 days via `expires_at`.
  const eventDbId = `wompi:${event.data.transaction.id}:${event.timestamp}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error: dedupError } = await db
    .from("webhook_events_processed")
    .insert([{
      event_id: eventDbId,
      provider: "wompi",
      event_type: event.event,
      expires_at: expiresAt,
    }]);

  if (dedupError) {
    // The SDK RETURNS the error instead of throwing, so the duplicate has to be
    // identified by SQLSTATE. Only a unique violation means "already processed";
    // anything else (backend down, permission problem) must NOT be acknowledged,
    // or the event would be silently dropped with no retry.
    if (dedupError.code === PG_UNIQUE_VIOLATION) {
      // Wompi retry — common for PSE/Nequi confirmation lag.
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("[wompi.webhook] dedup insert failed", { error_code: dedupError.code });
    return new NextResponse(null, { status: 500 });
  }

  // Log only id/type/timestamp, never the full event body.
  console.log("[wompi.webhook]", { event: event.event, tx_id: event.data.transaction.id, timestamp: event.timestamp });

  try {
    if (event.event === "transaction.updated") {
      // The checksum only covers the properties listed in `signature.properties`.
      // Re-fetch the transaction from the API before acting on fields like
      // amount/currency/reference that may not be checksum-covered.
      const authoritative = await refetchTransaction(event.data.transaction.id);
      await handleTransactionUpsert(db, authoritative ?? event.data.transaction);
    } else {
      // TODO: Wompi's `required_events_minimum` for one-time payments is only `transaction.updated`.
      // No other event types are expected for this integration; logged for visibility, not dropped silently.
      console.log("[wompi.webhook] unhandled event", event.event);
    }
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : "unknown";
    console.error("[wompi.webhook] handler error", { error_code: code });
    return new NextResponse(null, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function requireEventsSecret(): string {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) throw new Error("WOMPI_EVENTS_SECRET is not set. See .env.example.");
  return secret;
}

function verifyWompiChecksum(event: WompiEvent, secret: string): boolean {
  if (!event?.signature?.checksum || !event?.timestamp || !Array.isArray(event.signature.properties)) return false;
  // An empty property list would sign nothing but the timestamp and the secret.
  if (event.signature.properties.length === 0) return false;

  // Wompi's property paths are relative to `data`, not to the event root: the path
  // "transaction.id" means data.transaction.id. Resolving these from `event` yields
  // undefined for every property, which both rejects every genuine event and leaves
  // the signed string free of any transaction field.
  const values = event.signature.properties.map((path) =>
    path
      .split(".")
      .reduce<unknown>(
        (acc, key) => (acc == null ? undefined : (acc as Record<string, unknown>)[key]),
        event.data as unknown,
      ),
  );

  // A missing property must fail, never degrade to "". Otherwise an event that simply
  // omits id/status/amount would still produce a checksum that matches.
  if (values.some((v) => v == null)) return false;

  const concatenated = values.map((v) => String(v)).join("");

  const toSign = concatenated + event.timestamp + secret;
  const computed = crypto.createHash("sha256").update(toSign).digest("hex");

  if (computed.length !== event.signature.checksum.length) return false;
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(event.signature.checksum));
}

async function refetchTransaction(transactionId: string): Promise<WompiTransaction | null> {
  try {
    const res = await wompiFetch(`/transactions/${transactionId}`);
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: WompiTransaction };
    return body.data ?? null;
  } catch {
    return null;
  }
}

async function handleTransactionUpsert(db: ReturnType<typeof getAdminDb>, tx: WompiTransaction) {
  const { data, error } = await db
    .from("orders")
    .select("id")
    .eq("wompi_reference", tx.reference)
    .limit(1);

  // A failed lookup is not the same as "no such order": throw so the caller
  // answers 500 and Wompi retries, instead of acknowledging a lost event.
  if (error) throw Object.assign(new Error("order lookup failed"), { code: error.code });

  const existing = (data as Pick<OrderRow, "id">[] | null)?.[0];

  if (tx.status === "DECLINED") {
    const mapped = mapWompiError({ transaction: tx });
    console.error("[wompi.webhook] declined", { error_code: mapped.code, raw_code: mapped.raw_code, tx_id: tx.id });
  }

  if (!existing) {
    // Should not normally happen — the checkout route always pre-creates the order — but handle
    // it defensively rather than dropping the event.
    console.error("[wompi.webhook] no matching order for reference", { reference_present: !!tx.reference });
    return;
  }

  // updated_at is maintained by the orders_updated_at trigger, so it is not set here.
  const { error: updateError } = await db
    .from("orders")
    .update({
      wompi_transaction_id: tx.id,
      status: mapWompiStatus(tx.status),
    })
    .eq("id", existing.id);

  if (updateError) {
    throw Object.assign(new Error("order update failed"), { code: updateError.code });
  }
}

function mapWompiStatus(wompiStatus: string): string {
  switch (wompiStatus) {
    case "APPROVED": return "paid";
    case "PENDING": return "pending_payment"; // cash vouchers (Efecty/Baloto) can sit here up to 72h
    case "DECLINED": return "failed";
    case "VOIDED": return "refunded";
    case "ERROR": return "failed";
    default: return "pending_payment";
  }
}
