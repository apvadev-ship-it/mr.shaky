import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// ---- Mr. Shaky orders ----
// One row per pickup order, whether paid online (Wompi) or paid cash at pickup.
// Rule 11: collect only what staff need to hand over the order (name, phone, branch/date/time),
// nothing else (no address, no ID document, no date of birth).
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), // crypto.randomUUID()
  branch: text("branch").notNull(),
  pickupDate: text("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  items: text("items", { mode: "json" }).$type<{ id: string; name: string; qty: number }[]>().notNull(),
  subtotal: integer("subtotal").notNull(), // COP, before discount
  couponCode: text("coupon_code"), // uppercased fixed code, null if none applied
  discount: integer("discount").notNull().default(0), // COP, subtotal - total
  total: integer("total").notNull(), // COP, whole pesos (matches on-screen `money()` formatting)
  currency: text("currency").notNull().default("COP"),
  paymentMethod: text("payment_method").notNull(), // 'cash' | 'online'
  // pending_payment: online order awaiting Wompi webhook. pending_pickup: cash order, nothing charged yet.
  // paid / failed / refunded are only ever set by the Wompi webhook handler.
  status: text("status").notNull().default("pending_pickup"),
  wompiReference: text("wompi_reference"), // set at checkout init, used to reconcile the webhook
  wompiTransactionId: text("wompi_transaction_id"), // set once the webhook reports the real tx id
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  // Prevents webhook retries / races from silently updating the wrong order.
  wompiReferenceUnique: uniqueIndex("orders_wompi_reference_unique").on(t.wompiReference),
}));

// ---- PagoKit tables (Wompi) ----

// Rule 4: idempotency keys are crypto.randomUUID(), persisted before calling the provider.
export const pagokitIdempotencyKeys = sqliteTable("pagokit_idempotency_keys", {
  key: text("key").primaryKey(),
  requestHash: text("request_hash").notNull(),
  response: text("response", { mode: "json" }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at").notNull(),
});

// Rule 9: webhook replay protection via event-id dedup (Wompi also gives a timestamp window,
// handled in the webhook route itself).
export const pagokitWebhookEventsProcessed = sqliteTable("pagokit_webhook_events_processed", {
  eventId: text("event_id").primaryKey(),
  provider: text("provider").notNull(),
  eventType: text("event_type").notNull(),
  receivedAt: text("received_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at").notNull(),
});
