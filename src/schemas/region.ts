import { Schema } from "effect";

const RegionCsvSchema = Schema.Struct({
	id: Schema.String,
	name: Schema.String,
	name_en: Schema.String,
});

const RegionDbSchema = Schema.Struct({
	id: Schema.String,
	name: Schema.String,
	nameEn: Schema.String,
});

export const RegionTransform = Schema.transform(
	RegionCsvSchema,
	RegionDbSchema,
	{
		strict: true,
		decode: (csv) => ({
			id: csv.id,
			name: csv.name,
			nameEn: csv.name_en,
		}),
		encode: (db) => ({
			id: db.id,
			name: db.name,
			name_en: db.nameEn,
		}),
	},
);

export type Region = typeof RegionTransform.Type;
