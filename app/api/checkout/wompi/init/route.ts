import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/insforge-admin";
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

  // Server-generated UUID. Doubles as Wompi's idempotency-equivalent `reference`
  // (Wompi's checkout_spec does not support a separate Idempotency-Key header).
  const orderId = crypto.randomUUID();
  const reference = `mrshaky_${orderId}`;
  const amountInCents = toWompiCentavos(total);

  const concatenation = `${reference}${amountInCents}COP${process.env.WOMPI_INTEGRITY_SECRET}`;
  const integritySignature = crypto.createHash("sha256").update(concatenation).digest("hex");

  // Only name + phone collected (needed so staff can identify the pickup), no address/ID/DOB.
  // The order must be persisted BEFORE the widget opens: the webhook reconciles by
  // wompi_reference, so if this row is missing the payment cannot be matched.
  const { error } = await getAdminDb()
    .from("orders")
    .insert([{
      id: orderId,
      branch: branch.name,
      pickup_date: input.pickupDate,
      pickup_time: input.pickupTime,
      customer_name: customerName,
      customer_phone: customerPhone,
      items: items.map(({ id, name, qty }) => ({ id, name, qty })),
      subtotal,
      coupon_code: couponCode,
      discount,
      total,
      currency: "COP",
      payment_method: "online",
      status: "pending_payment",
      wompi_reference: reference,
    }]);

  if (error) {
    // Do not hand the client a signature for an order that was never stored.
    console.error("[wompi.init] insert failed", { error_code: error.code });
    return NextResponse.json({ error: "order_not_created" }, { status: 500 });
  }

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
