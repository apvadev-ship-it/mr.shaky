import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";

// Used by the return page / order dialog to poll status after the Wompi widget closes.
// DO NOT use this to grant access on the client — it only reflects what the webhook has already
// written; the widget's own callback status must never be trusted for that.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({
    id: order.id,
    branch: order.branch,
    pickupDate: order.pickupDate,
    pickupTime: order.pickupTime,
    items: order.items,
    subtotal: order.subtotal,
    couponCode: order.couponCode,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.paymentMethod,
    status: order.status,
  });
}
