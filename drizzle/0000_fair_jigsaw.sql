CREATE TYPE "public"."company_type" AS ENUM('other', 'jr', 'major_private', 'semi_major');--> statement-breakpoint
CREATE TYPE "public"."entity_status" AS ENUM('active', 'pre_opening', 'defunct');--> statement-breakpoint
CREATE TABLE "companies" (
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
CREATE TABLE "lines" (
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
	"longitude" real,
	"latitude" real,
	"map_zoom" smallint,
	"status" "entity_status" DEFAULT 'active' NOT NULL,
	"sort_order" integer
);
--> statement-breakpoint
CREATE TABLE "prefectures" (
	"id" smallint PRIMARY KEY NOT NULL,
	"name" varchar(16) NOT NULL,
	"name_kana" varchar(32),
	"name_en" varchar(32) NOT NULL,
	"region_id" varchar(16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"name_en" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stations" (
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
	"longitude" real,
	"latitude" real,
	"opened_on" date,
	"closed_on" date,
	"status" "entity_status" DEFAULT 'active' NOT NULL,
	"sort_order" integer
);
--> statement-breakpoint
ALTER TABLE "lines" ADD CONSTRAINT "lines_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prefectures" ADD CONSTRAINT "prefectures_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_line_id_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_prefecture_id_prefectures_id_fk" FOREIGN KEY ("prefecture_id") REFERENCES "public"."prefectures"("id") ON DELETE no action ON UPDATE no action;