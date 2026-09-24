import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, pagokitWebhookEventsProcessed } from "@/db/schema";
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

// @pagokit:signature-verified — verifyWompiChecksum() is called below before any event data is trusted.
export async function POST(request: Request) {
  // Rule 10: body size guard.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 256 * 1024) {
    return new NextResponse(null, { status: 413 });
  }

  // Rule 5: raw body read before any parsing (Wompi's checksum is body-embedded, but we keep the
  // same discipline as HMAC-header providers for consistency and future-proofing).
  const rawBody = await request.text();
  let event: WompiEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  // Rule 3: verify the checksum before trusting anything in the payload.
  if (!verifyWompiChecksum(event, requireEventsSecret())) {
    return new NextResponse(null, { status: 400 });
  }

  // Rule 9: reject events outside Wompi's recommended 10-minute tolerance window.
  const now = Math.floor(Date.now() / 1000);
  if (!event.timestamp || Math.abs(now - event.timestamp) > 600) {
    return new NextResponse(null, { status: 400 });
  }

  const db = getDb();

  // Rule 9 (secondary): dedup — Wompi doesn't expose a standalone event id, so we compose one
  // from the transaction id + timestamp. TTL of 7 days via `expiresAt`.
  const eventDbId = `wompi:${event.data.transaction.id}:${event.timestamp}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  try {
    await db.insert(pagokitWebhookEventsProcessed).values({
      eventId: eventDbId,
      provider: "wompi",
      eventType: event.event,
      expiresAt,
    });
  } catch {
    // Already processed — this is a Wompi retry (common for PSE/Nequi confirmation lag).
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Rule 6: log only id/type/created-equivalent fields, never the full event body.
  console.log("[wompi.webhook]", { event: event.event, tx_id: event.data.transaction.id, timestamp: event.timestamp });

  try {
    if (event.event === "transaction.updated") {
      // The checksum only covers the properties listed in `signature.properties` (per Wompi docs
      // and PagoKit's verified evidence for this provider). Re-fetch the transaction from the API
      // before acting on fields like amount/currency/reference that may not be checksum-covered.
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

  const concatenated = event.signature.properties
    .map((path) => path.split(".").reduce<unknown>((acc, key) => (acc == null ? undefined : (acc as Record<string, unknown>)[key]), event as unknown))
    .map((v) => (v == null ? "" : String(v)))
    .join("");

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

async function handleTransactionUpsert(db: ReturnType<typeof getDb>, tx: WompiTransaction) {
  const [existing] = await db.select().from(orders).where(eq(orders.wompiReference, tx.reference)).limit(1);

  if (tx.status === "DECLINED") {
    const mapped = mapWompiError({ transaction: tx });
    console.error("[wompi.webhook] declined", { pagokit_code: mapped.code, raw_code: mapped.raw_code, tx_id: tx.id });
  }

  if (!existing) {
    // Should not normally happen — the checkout route always pre-creates the order — but handle
    // it defensively rather than dropping the event.
    console.error("[wompi.webhook] no matching order for reference", { reference_present: !!tx.reference });
    return;
  }

  await db
    .update(orders)
    .set({
      wompiTransactionId: tx.id,
      status: mapWompiStatus(tx.status),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(orders.id, existing.id));
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
