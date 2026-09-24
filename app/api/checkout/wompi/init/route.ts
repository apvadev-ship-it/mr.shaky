import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { products, branches } from "@/lib/demo-data";
import { getCouponPercent, applyDiscount } from "@/lib/coupons";
import { toWompiCentavos } from "@/lib/payments/wompi";
import crypto from "node:crypto";

interface InitInput {
  branch: string;
  pickupDate: string;
  pickupTime: string;
  customerName: string;
  customerPhone: string;
  cart: Record<string, number>;
  couponCode?: string;
}

export async function POST(request: Request) {
  let input: InitInput;
  try {
    input = (await request.json()) as InitInput;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const branch = branches.find((b) => b.id === input.branch);
  const customerName = input.customerName?.trim();
  const customerPhone = input.customerPhone?.trim();
  if (!branch || !input.pickupDate || !input.pickupTime || !customerName || !customerPhone) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (new Date(`${input.pickupDate}T${input.pickupTime}`).getTime() < Date.now() + 30 * 60000) {
    return NextResponse.json({ error: "pickup_time_too_soon" }, { status: 400 });
  }

  // Never trust prices/quantities from the client — recompute from the server-side catalog.
  const items = Object.entries(input.cart ?? {})
    .filter(([, qty]) => Number.isInteger(qty) && qty > 0 && qty <= 99)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? { id, name: product.name, qty, price: product.price } : null;
    })
    .filter((v): v is { id: string; name: string; qty: number; price: number } => v !== null);

  if (!items.length) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  // Rule: never trust a discount computed on the client — recompute from the fixed coupon table.
  const couponPercent = getCouponPercent(input.couponCode);
  const couponCode = couponPercent !== null ? input.couponCode!.trim().toUpperCase() : null;
  const total = couponPercent !== null ? applyDiscount(subtotal, couponPercent) : subtotal;
  const discount = subtotal - total;
  if (!process.env.WOMPI_INTEGRITY_SECRET) {
    return NextResponse.json({ error: "wompi_not_configured" }, { status: 500 });
  }

  // Rule 4: server-generated UUID. Doubles as Wompi's idempotency-equivalent `reference`
  // (Wompi's checkout_spec does not support a separate Idempotency-Key header).
  const orderId = crypto.randomUUID();
  const reference = `mrshaky_${orderId}`;
  const amountInCents = toWompiCentavos(total);

  const concatenation = `${reference}${amountInCents}COP${process.env.WOMPI_INTEGRITY_SECRET}`;
  const integritySignature = crypto.createHash("sha256").update(concatenation).digest("hex");

  const db = getDb();
  // Rule 11: only name + phone collected (needed so staff can identify the pickup), no address/ID/DOB.
  await db.insert(orders).values({
    id: orderId,
    branch: branch.name,
    pickupDate: input.pickupDate,
    pickupTime: input.pickupTime,
    customerName,
    customerPhone,
    items: items.map(({ id, name, qty }) => ({ id, name, qty })),
    subtotal,
    couponCode,
    discount,
    total,
    currency: "COP",
    paymentMethod: "online",
    status: "pending_payment",
    wompiReference: reference,
  });

  return NextResponse.json({
    orderId,
    reference,
    amountInCents,
    currency: "COP",
    integritySignature,
    publicKey: process.env.WOMPI_PUBLIC_KEY,
    redirectUrl: `${process.env.PUBLIC_URL ?? ""}/checkout/wompi/return?order=${orderId}`,
  });
}
