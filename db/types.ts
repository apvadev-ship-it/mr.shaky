// Row shapes as the InsForge SDK returns them.
//
// These mirror db/schema.ts, but the column names are snake_case: Drizzle mapped
// camelCase fields onto snake_case columns, whereas the SDK talks to PostgREST and
// uses the real column names. The authoritative definition of these tables is the
// applied migration in migrations/.

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
}

export interface OrderRow {
  id: string;
  branch: string;
  pickup_date: string;
  pickup_time: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  subtotal: number;
  coupon_code: string | null;
  discount: number;
  total: number;
  currency: string;
  payment_method: "cash" | "online";
  status: string;
  wompi_reference: string | null;
  wompi_transaction_id: string | null;
  created_at: string;
  updated_at: string;
}
