import { Schema } from "effect";

import { CompanyType, EntityStatus } from "@/schemas/shared";
import { NullNum, NullStr } from "@/schemas/utils";

export const CompanyCsvSchema = Schema.Struct({
	company_cd: Schema.NumberFromString,
	rr_cd: NullNum,
	company_name: Schema.String,
	company_name_k: NullStr,
	company_name_h: NullStr,
	company_name_r: NullStr,
	company_name_en: NullStr,
	company_name_en_formal: NullStr,
	company_url: NullStr,
	company_type: CompanyType,
	e_status: EntityStatus,
	e_sort: NullNum,
});

export const CompanyDbSchema = Schema.Struct({
	id: Schema.Number,
	rrCd: Schema.NullOr(Schema.Number),
	name: Schema.String,
	nameKana: Schema.NullOr(Schema.String),
	nameHira: Schema.NullOr(Schema.String),
	nameRomaji: Schema.String,
	nameEn: Schema.NullOr(Schema.String),
	nameEnFormal: Schema.NullOr(Schema.String),
	url: Schema.NullOr(Schema.String),
	type: Schema.Literal("other", "jr", "major_private", "semi_major"),
	status: Schema.Literal("active", "pre_opening", "defunct"),
	sort: Schema.NullOr(Schema.Number),
});

export type CompanyCsv = typeof CompanyCsvSchema.Type;
export type CompanyDb = typeof CompanyDbSchema.Type;
