CREATE TABLE "access_link_open" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"link_id" text NOT NULL,
	"outcome" text NOT NULL,
	"visitor_hash" text,
	"country" text,
	"region" text,
	"city" text
);
--> statement-breakpoint
CREATE TABLE "page_view" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"path" text NOT NULL,
	"visitor_hash" text,
	"country" text,
	"region" text,
	"city" text,
	"referrer" text,
	"access_link_id" text
);
--> statement-breakpoint
CREATE INDEX "access_link_open_link_idx" ON "access_link_open" USING btree ("link_id","opened_at");--> statement-breakpoint
CREATE INDEX "page_view_viewed_idx" ON "page_view" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "page_view_link_idx" ON "page_view" USING btree ("access_link_id");