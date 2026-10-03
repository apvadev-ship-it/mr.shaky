import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/insforge-admin";
import { products, branches } from "@/lib/demo-data";
import { getCouponPercent, applyDiscount } from "@/lib/coupons";
import crypto from "node:crypto";

interface OrderInput {
  branch: string;
  pickupDate: string;
  pickupTime: string;
  customerName: string;
  customerPhone: string;
  cart: Record<string, number>;
  couponCode?: string;
}

// Cash-on-pickup path: no charge happens here. Nothing is sent to Wompi.
export async function POST(request: Request) {
  let input: OrderInput;
  try {
    input = (await request.json()) as OrderInput;
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
  const orderId = crypto.randomUUID();

  // Inserts take an array. The admin client runs as project_admin, the only role
  // with access to `orders`.
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
      payment_method: "cash",
      status: "pending_pickup",
    }]);

  if (error) {
    // Log the code only — never the row, which carries the customer's name and phone.
    console.error("[orders.create] insert failed", { error_code: error.code });
    return NextResponse.json({ error: "order_not_created" }, { status: 500 });
  }

  return NextResponse.json({
    orderId,
    branch: branch.name,
    pickupDate: input.pickupDate,
    pickupTime: input.pickupTime,
    subtotal,
    couponCode,
    discount,
    total,
    items: items.map(({ name, qty }) => ({ name, qty })),
  });
}
