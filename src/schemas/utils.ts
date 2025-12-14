import { Schema } from "effect";

export const NullStr = Schema.transform(
	Schema.String,
	Schema.NullOr(Schema.String),
	{
		strict: true,
		decode: (s) => (s === "" ? null : s),
		encode: (s) => s ?? "",
	},
);

export const NullNum = Schema.transform(
	Schema.String,
	Schema.NullOr(Schema.Number),
	{
		strict: true,
		decode: (s) => {
			if (s === "") return null;
			const n = Number(s);
			return Number.isNaN(n) ? null : n;
		},
		encode: (n) => (n === null ? "" : String(n)),
	},
);

export const NullDate = Schema.transform(
	Schema.String,
	Schema.NullOr(Schema.String),
	{
		strict: true,
		decode: (s) => (s === "" || s === "0000-00-00" ? null : s),
		encode: (s) => s ?? "",
	},
);

export const NumEnum = <const T extends string[]>(
	values: T,
	fallback: T[number],
) =>
	Schema.transform(Schema.String, Schema.Literal(...values), {
		strict: true,
		decode: (s) => (values[Number(s)] ?? fallback) as T[number],
		encode: (v) => String(values.indexOf(v)),
	});

export const PointSchema = Schema.Struct({
	x: Schema.Number,
	y: Schema.Number,
});

export type Point = typeof PointSchema.Type;
