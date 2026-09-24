CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`branch` text NOT NULL,
	`pickup_date` text NOT NULL,
	`pickup_time` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`items` text NOT NULL,
	`total` integer NOT NULL,
	`currency` text DEFAULT 'COP' NOT NULL,
	`payment_method` text NOT NULL,
	`status` text DEFAULT 'pending_pickup' NOT NULL,
	`wompi_reference` text,
	`wompi_transaction_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_wompi_reference_unique` ON `orders` (`wompi_reference`);--> statement-breakpoint
CREATE TABLE `pagokit_idempotency_keys` (
	`key` text PRIMARY KEY NOT NULL,
	`request_hash` text NOT NULL,
	`response` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pagokit_webhook_events_processed` (
	`event_id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`event_type` text NOT NULL,
	`received_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL
);
