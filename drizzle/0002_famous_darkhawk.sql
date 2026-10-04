ALTER TABLE "shops" ALTER COLUMN "phone" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "bank_name" varchar(200);--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "bank_branch" varchar(200);--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "bank_ifsc" varchar(50);--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "bank_account_number" varchar(50);