CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."resume_status" AS ENUM('draft', 'shared', 'revoked');--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "case_study" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"body" text NOT NULL,
	"client" text,
	"role" text,
	"year_start" integer,
	"year_end" integer,
	"cover_image_url" text,
	"position_id" uuid,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "case_study_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "case_study_tag" (
	"case_study_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "case_study_tag_case_study_id_tag_id_pk" PRIMARY KEY("case_study_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "position_highlight" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position_id" uuid NOT NULL,
	"content" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization" text NOT NULL,
	"title" text NOT NULL,
	"employment_type" text,
	"location" text,
	"start_date" date NOT NULL,
	"end_date" date,
	"summary" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "skill_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "resume_case_study" (
	"resume_id" uuid NOT NULL,
	"case_study_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"blurb_override" text,
	CONSTRAINT "resume_case_study_resume_id_case_study_id_pk" PRIMARY KEY("resume_id","case_study_id")
);
--> statement-breakpoint
CREATE TABLE "resume_highlight" (
	"resume_id" uuid NOT NULL,
	"highlight_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "resume_highlight_resume_id_highlight_id_pk" PRIMARY KEY("resume_id","highlight_id")
);
--> statement-breakpoint
CREATE TABLE "resume_position" (
	"resume_id" uuid NOT NULL,
	"position_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"summary_override" text,
	CONSTRAINT "resume_position_resume_id_position_id_pk" PRIMARY KEY("resume_id","position_id")
);
--> statement-breakpoint
CREATE TABLE "resume_skill" (
	"resume_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "resume_skill_resume_id_skill_id_pk" PRIMARY KEY("resume_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "resume_view" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resume_id" uuid NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"visitor_hash" text,
	"user_agent" text,
	"referrer" text
);
--> statement-breakpoint
CREATE TABLE "resume" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"target_role" text,
	"target_company" text,
	"headline" text,
	"summary" text,
	"share_token" text NOT NULL,
	"status" "resume_status" DEFAULT 'draft' NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resume_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_study" ADD CONSTRAINT "case_study_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_study_tag" ADD CONSTRAINT "case_study_tag_case_study_id_case_study_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."case_study"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_study_tag" ADD CONSTRAINT "case_study_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position_highlight" ADD CONSTRAINT "position_highlight_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_case_study" ADD CONSTRAINT "resume_case_study_resume_id_resume_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_case_study" ADD CONSTRAINT "resume_case_study_case_study_id_case_study_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."case_study"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_highlight" ADD CONSTRAINT "resume_highlight_resume_id_resume_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_highlight" ADD CONSTRAINT "resume_highlight_highlight_id_position_highlight_id_fk" FOREIGN KEY ("highlight_id") REFERENCES "public"."position_highlight"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_position" ADD CONSTRAINT "resume_position_resume_id_resume_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_position" ADD CONSTRAINT "resume_position_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_skill" ADD CONSTRAINT "resume_skill_resume_id_resume_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_skill" ADD CONSTRAINT "resume_skill_skill_id_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_view" ADD CONSTRAINT "resume_view_resume_id_resume_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "case_study_status_idx" ON "case_study" USING btree ("status","featured","sort_order");--> statement-breakpoint
CREATE INDEX "case_study_position_idx" ON "case_study" USING btree ("position_id");--> statement-breakpoint
CREATE INDEX "case_study_tag_tag_idx" ON "case_study_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "position_highlight_position_idx" ON "position_highlight" USING btree ("position_id","sort_order");--> statement-breakpoint
CREATE INDEX "position_status_start_idx" ON "position" USING btree ("status","start_date");--> statement-breakpoint
CREATE INDEX "resume_case_study_case_study_idx" ON "resume_case_study" USING btree ("case_study_id");--> statement-breakpoint
CREATE INDEX "resume_highlight_highlight_idx" ON "resume_highlight" USING btree ("highlight_id");--> statement-breakpoint
CREATE INDEX "resume_position_position_idx" ON "resume_position" USING btree ("position_id");--> statement-breakpoint
CREATE INDEX "resume_skill_skill_idx" ON "resume_skill" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "resume_view_resume_idx" ON "resume_view" USING btree ("resume_id","viewed_at");