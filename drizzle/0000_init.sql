CREATE TYPE "public"."company_type" AS ENUM('other', 'jr', 'major_private', 'semi_major');--> statement-breakpoint
CREATE TYPE "public"."entity_status" AS ENUM('active', 'pre_opening', 'defunct');--> statement-breakpoint
CREATE TYPE "public"."stamp_shape" AS ENUM('circle', 'square', 'hexagon', 'pentagon', 'other');--> statement-breakpoint
CREATE TYPE "public"."stamp_status" AS ENUM('available', 'discontinued', 'limited');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" integer PRIMARY KEY NOT NULL,
	"railway_category_id" smallint,
	"name" varchar(256) NOT NULL,
	"name_kana" varchar(256),
	"name_formal" varchar(256),
	"name_romaji" varchar(256),
	"name_en" varchar(256),
	"name_en_formal" varchar(256),
	"website_url" varchar(512),
	"type" "company_type" DEFAULT 'other' NOT NULL,
	"status" "entity_status" DEFAULT 'active' NOT NULL,
	"sort_order" integer
);
--> statement-breakpoint
CREATE TABLE "line" (
	"id" integer PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"name_kana" varchar(256),
	"name_formal" varchar(256),
	"name_en" varchar(256),
	"name_en_formal" varchar(256),
	"color_hex" varchar(8),
	"color_name" varchar(64),
	"type" smallint,
	"location" geometry(point),
	"map_zoom" smallint,
	"status" "entity_status" DEFAULT 'active' NOT NULL,
	"sort_order" integer
);
--> statement-breakpoint
CREATE TABLE "prefecture" (
	"id" smallint PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"name_kana" varchar(32),
	"name_en" varchar(32) NOT NULL,
	"region_id" varchar(16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"name_en" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "stamp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"station_id" integer,
	"rally_id" uuid,
	"name" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"description" text,
	"description_en" text,
	"location_name" varchar(255),
	"location_name_en" varchar(255),
	"location_note" text,
	"location_note_en" text,
	"shape" "stamp_shape",
	"size_cm" varchar(32),
	"color" varchar(32),
	"color_en" varchar(32),
	"status" "stamp_status" DEFAULT 'available' NOT NULL,
	"available_from" date,
	"available_until" date,
	"image_url" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stamp_rally" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"start_date" date,
	"end_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stamp_rally_organizer" (
	"rally_id" uuid NOT NULL,
	"company_id" integer NOT NULL,
	CONSTRAINT "stamp_rally_organizer_rally_id_company_id_pk" PRIMARY KEY("rally_id","company_id")
);
--> statement-breakpoint
CREATE TABLE "station" (
	"id" integer PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"name_kana" varchar(256),
	"name_romaji" varchar(256),
	"name_en" varchar(256),
	"name_en_formal" varchar(256),
	"line_id" integer NOT NULL,
	"prefecture_id" smallint NOT NULL,
	"postal_code" varchar(16),
	"address" text,
	"location" geometry(point),
	"opened_on" date,
	"closed_on" date,
	"status" "entity_status" DEFAULT 'active' NOT NULL,
	"sort_order" integer
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "line" ADD CONSTRAINT "line_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prefecture" ADD CONSTRAINT "prefecture_region_id_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."region"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stamp" ADD CONSTRAINT "stamp_station_id_station_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."station"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stamp" ADD CONSTRAINT "stamp_rally_id_stamp_rally_id_fk" FOREIGN KEY ("rally_id") REFERENCES "public"."stamp_rally"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stamp_rally_organizer" ADD CONSTRAINT "stamp_rally_organizer_rally_id_stamp_rally_id_fk" FOREIGN KEY ("rally_id") REFERENCES "public"."stamp_rally"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stamp_rally_organizer" ADD CONSTRAINT "stamp_rally_organizer_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "station" ADD CONSTRAINT "station_line_id_line_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."line"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "station" ADD CONSTRAINT "station_prefecture_id_prefecture_id_fk" FOREIGN KEY ("prefecture_id") REFERENCES "public"."prefecture"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "line_location_idx" ON "line" USING gist ("location");--> statement-breakpoint
CREATE INDEX "stamp_station_id_idx" ON "stamp" USING btree ("station_id");--> statement-breakpoint
CREATE INDEX "stamp_rally_id_idx" ON "stamp" USING btree ("rally_id");--> statement-breakpoint
CREATE INDEX "stamp_rally_organizer_rally_id_idx" ON "stamp_rally_organizer" USING btree ("rally_id");--> statement-breakpoint
CREATE INDEX "stamp_rally_organizer_company_id_idx" ON "stamp_rally_organizer" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "station_location_idx" ON "station" USING gist ("location");