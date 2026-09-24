import { sql } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// ---- Mr. Shaky orders ----
// One row per pickup order, whether paid online (Wompi) or paid cash at pickup.
// Collect only what staff need to hand over the order (name, phone, branch/date/time),
// nothing else (no address, no ID document, no date of birth).
export const orders = pgTable("orders", {
  id: text("id").primaryKey(), // crypto.randomUUID()
  branch: text("branch").notNull(),
  pickupDate: text("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  items: jsonb("items").$type<{ id: string; name: string; qty: number }[]>().notNull(),
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
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().default(sql`now()`),
}, (t) => ({
  // Prevents webhook retries / races from silently updating the wrong order.
  wompiReferenceUnique: uniqueIndex("orders_wompi_reference_unique").on(t.wompiReference),
}));

// ---- Payment support tables (Wompi) ----

// Idempotency keys are crypto.randomUUID(), persisted before calling the provider.
export const paymentIdempotencyKeys = pgTable("payment_idempotency_keys", {
  key: text("key").primaryKey(),
  requestHash: text("request_hash").notNull(),
  response: jsonb("response"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().default(sql`now()`),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
});

// Webhook replay protection via event-id dedup (Wompi also gives a timestamp window,
// handled in the webhook route itself).
export const webhookEventsProcessed = pgTable("webhook_events_processed", {
  eventId: text("event_id").primaryKey(),
  provider: text("provider").notNull(),
  eventType: text("event_type").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true, mode: "string" }).notNull().default(sql`now()`),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
});
