import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/insforge-admin";
import type { OrderRow } from "@/db/types";

// Used by the return page / order dialog to poll status after the Wompi widget closes.
// DO NOT use this to grant access on the client — it only reflects what the webhook has already
// written; the widget's own callback status must never be trusted for that.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Name the columns: this response is public-facing, so customer_phone and
  // customer_name must not be fetched here, let alone returned.
  const { data, error } = await getAdminDb()
    .from("orders")
    .select(
      "id, branch, pickup_date, pickup_time, items, subtotal, coupon_code, discount, total, payment_method, status",
    )
    .eq("id", id)
    .limit(1);

  if (error) {
    console.error("[orders.get] query failed", { error_code: error.code });
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }

  const order = (data as Pick<
    OrderRow,
    | "id"
    | "branch"
    | "pickup_date"
    | "pickup_time"
    | "items"
    | "subtotal"
    | "coupon_code"
    | "discount"
    | "total"
    | "payment_method"
    | "status"
  >[] | null)?.[0];
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({
    id: order.id,
    branch: order.branch,
    pickupDate: order.pickup_date,
    pickupTime: order.pickup_time,
    items: order.items,
    subtotal: order.subtotal,
    couponCode: order.coupon_code,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.payment_method,
    status: order.status,
  });
}
