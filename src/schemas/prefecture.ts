import { Schema } from "effect";

import { NullStr } from "@/schemas/utils";

export const PrefectureCsvSchema = Schema.Struct({
	id: Schema.NumberFromString,
	name: Schema.String,
	name_kana: NullStr,
	name_en: Schema.String,
	region_id: Schema.String,
});

const PrefectureDbSchema = Schema.Struct({
	id: Schema.Number,
	name: Schema.String,
	nameKana: Schema.NullOr(Schema.String),
	nameEn: Schema.String,
	regionId: Schema.String,
});

export const PrefectureTransform = Schema.transform(
	PrefectureCsvSchema,
	PrefectureDbSchema,
	{
		strict: true,
		decode: (csv) => ({
			id: csv.id,
			name: csv.name,
			nameKana: csv.name_kana,
			nameEn: csv.name_en,
			regionId: csv.region_id,
		}),
		encode: (db) => ({
			id: db.id,
			name: db.name,
			name_kana: db.nameKana,
			name_en: db.nameEn,
			region_id: db.regionId,
		}),
	},
);

export type Prefecture = typeof PrefectureTransform.Type;
