import { Schema } from "effect";

import { EntityStatus } from "@/schemas/shared";
import { NullDate, NullNum, NullStr, PointSchema } from "@/schemas/utils";

export const StationCsvSchema = Schema.Struct({
	station_cd: Schema.NumberFromString,
	station_g_cd: Schema.NumberFromString,
	station_name: Schema.String,
	station_name_k: NullStr,
	station_name_r: NullStr,
	name_english: Schema.optional(NullStr),
	name_english_formal: Schema.optional(NullStr),
	line_cd: Schema.NumberFromString,
	pref_cd: Schema.NumberFromString,
	post: NullStr,
	address: NullStr,
	lon: NullNum,
	lat: NullNum,
	open_ymd: NullDate,
	close_ymd: NullDate,
	e_status: EntityStatus,
	e_sort: NullNum,
});

export const StationDbSchema = Schema.Struct({
	id: Schema.Number, // Uses station_g_cd as unique physical station ID
	name: Schema.String,
	nameKana: Schema.String,
	nameRomaji: Schema.String,
	nameEn: Schema.NullOr(Schema.String),
	nameEnFormal: Schema.NullOr(Schema.String),
	prefectureId: Schema.Number,
	postalCode: Schema.NullOr(Schema.String),
	address: Schema.NullOr(Schema.String),
	location: Schema.NullOr(PointSchema),
	openedOn: Schema.NullOr(Schema.String),
	closedOn: Schema.NullOr(Schema.String),
	status: Schema.Literal("active", "pre_opening", "defunct"),
});

export const StationLineDbSchema = Schema.Struct({
	stationId: Schema.Number,
	lineId: Schema.Number,
	originalStationId: Schema.Number,
	sortOrder: Schema.NullOr(Schema.Number),
});

export type StationCsv = typeof StationCsvSchema.Type;
export type StationDb = typeof StationDbSchema.Type;
export type StationLineDb = typeof StationLineDbSchema.Type;
