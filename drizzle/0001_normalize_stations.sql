CREATE TABLE "station_line" (
	"station_id" integer NOT NULL,
	"line_id" integer NOT NULL,
	"original_station_id" integer NOT NULL,
	"sort_order" integer,
	CONSTRAINT "station_line_station_id_line_id_pk" PRIMARY KEY("station_id","line_id")
);
--> statement-breakpoint
ALTER TABLE "station" DROP CONSTRAINT "station_line_id_line_id_fk";
--> statement-breakpoint
ALTER TABLE "station_line" ADD CONSTRAINT "station_line_station_id_station_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."station"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "station_line" ADD CONSTRAINT "station_line_line_id_line_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."line"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "station_line_station_id_idx" ON "station_line" USING btree ("station_id");--> statement-breakpoint
CREATE INDEX "station_line_line_id_idx" ON "station_line" USING btree ("line_id");--> statement-breakpoint
ALTER TABLE "station" DROP COLUMN "group_id";--> statement-breakpoint
ALTER TABLE "station" DROP COLUMN "line_id";--> statement-breakpoint
ALTER TABLE "station" DROP COLUMN "sort_order";