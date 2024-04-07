ALTER TABLE movies ADD `created_by` text NOT NULL;--> statement-breakpoint
ALTER TABLE movies ADD `updated_by` text;--> statement-breakpoint
ALTER TABLE series ADD `created_by` text NOT NULL;--> statement-breakpoint
ALTER TABLE series ADD `updated_by` text;