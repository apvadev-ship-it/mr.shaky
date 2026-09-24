CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"branch" text NOT NULL,
	"pickup_date" text NOT NULL,
	"pickup_time" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" integer NOT NULL,
	"coupon_code" text,
	"discount" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"currency" text DEFAULT 'COP' NOT NULL,
	"payment_method" text NOT NULL,
	"status" text DEFAULT 'pending_pickup' NOT NULL,
	"wompi_reference" text,
	"wompi_transaction_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_idempotency_keys" (
	"key" text PRIMARY KEY NOT NULL,
	"request_hash" text NOT NULL,
	"response" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events_processed" (
	"event_id" text PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"event_type" text NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "orders_wompi_reference_unique" ON "orders" USING btree ("wompi_reference");