CREATE TABLE "bank_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"bank_name" varchar(200),
	"bank_branch" varchar(200),
	"bank_ifsc" varchar(50),
	"bank_account_number" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bank_details_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "shops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"owner_name" varchar(200),
	"gst_number" varchar(20),
	"phone" varchar(50),
	"address" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(128) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "sales_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"invoice_number" integer NOT NULL,
	"cgst_percent" numeric DEFAULT 0 NOT NULL,
	"cgst_amount" numeric DEFAULT 0 NOT NULL,
	"sgst_percent" numeric DEFAULT 0 NOT NULL,
	"sgst_amount" numeric DEFAULT 0 NOT NULL,
	"sub_total" numeric DEFAULT 0 NOT NULL,
	"grand_total" numeric DEFAULT 0 NOT NULL,
	"discount_amount" numeric DEFAULT 0 NOT NULL,
	"notes" varchar,
	"created_at" date NOT NULL,
	"financial_year" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar,
	"address" varchar,
	"gst_number" varchar
);
--> statement-breakpoint
CREATE TABLE "sales_invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" varchar NOT NULL,
	"metal_type" varchar NOT NULL,
	"metal_purity" varchar,
	"metal_rate" numeric DEFAULT 0 NOT NULL,
	"gross_weight" numeric DEFAULT 0 NOT NULL,
	"net_weight" numeric DEFAULT 0 NOT NULL,
	"making_charges_percent" numeric DEFAULT 0 NOT NULL,
	"making_charges_amount" numeric DEFAULT 0 NOT NULL,
	"item_total" numeric DEFAULT 0 NOT NULL,
	"inventory_item_id" uuid
);
--> statement-breakpoint
CREATE TABLE "purchase_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"invoice_number" integer NOT NULL,
	"sub_total" numeric DEFAULT 0 NOT NULL,
	"grand_total" numeric DEFAULT 0 NOT NULL,
	"notes" varchar,
	"created_at" date NOT NULL,
	"financial_year" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar,
	"address" varchar,
	"gst_number" varchar
);
--> statement-breakpoint
CREATE TABLE "purchase_invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" varchar NOT NULL,
	"metal_type" varchar NOT NULL,
	"metal_purity" varchar,
	"metal_rate" numeric DEFAULT 0 NOT NULL,
	"gross_weight" numeric DEFAULT 0 NOT NULL,
	"net_weight" numeric DEFAULT 0 NOT NULL,
	"item_total" numeric DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"item_code" varchar(10) NOT NULL,
	"category_id" uuid NOT NULL,
	"metal_type" varchar(50) NOT NULL,
	"metal_purity" varchar(20),
	"gross_weight" numeric(10, 3) DEFAULT 0 NOT NULL,
	"net_weight" numeric(10, 3) DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'available' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bank_details" ADD CONSTRAINT "bank_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shops" ADD CONSTRAINT "shops_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_customers" ADD CONSTRAINT "sales_customers_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_items" ADD CONSTRAINT "sales_invoice_items_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_suppliers" ADD CONSTRAINT "purchase_suppliers_invoice_id_purchase_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."purchase_invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_invoice_items" ADD CONSTRAINT "purchase_invoice_items_invoice_id_purchase_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."purchase_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_categories" ADD CONSTRAINT "inventory_categories_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_category_id_inventory_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."inventory_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sales_invoices_shop_fy_number_idx" ON "sales_invoices" USING btree ("shop_id","financial_year","invoice_number");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_invoices_shop_fy_number_idx" ON "purchase_invoices" USING btree ("shop_id","financial_year","invoice_number");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_categories_shop_name_idx" ON "inventory_categories" USING btree ("shop_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_items_shop_item_code_idx" ON "inventory_items" USING btree ("shop_id","item_code");