import { Effect } from "effect";
import { mapCompany, mapLine, mapStation } from "@/parsing/mappers";
import { CompanyCsvSchema } from "@/schemas/company";
import { LineCsvSchema } from "@/schemas/line";
import { PrefectureTransform } from "@/schemas/prefecture";
import { RegionTransform } from "@/schemas/region";
import { StationCsvSchema } from "@/schemas/station";
import { CsvService } from "@/services/csv";

export const parseRegions = (dataDir: string) =>
	Effect.gen(function* () {
		const csv = yield* CsvService;
		return yield* csv.parseFile(`${dataDir}/regions.csv`, RegionTransform);
	});

export const parsePrefectures = (dataDir: string) =>
	Effect.gen(function* () {
		const csv = yield* CsvService;
		return yield* csv.parseFile(
			`${dataDir}/prefectures.csv`,
			PrefectureTransform,
		);
	});

export const parseCompanies = (dataDir: string) =>
	Effect.gen(function* () {
		const csv = yield* CsvService;
		const rows = yield* csv.parseFile(
			`${dataDir}/company20251015.csv`,
			CompanyCsvSchema,
		);
		return yield* Effect.forEach(rows, mapCompany);
	});

export const parseLines = (dataDir: string) =>
	Effect.gen(function* () {
		const csv = yield* CsvService;
		const rows = yield* csv.parseFile(
			`${dataDir}/line20250604free.csv`,
			LineCsvSchema,
		);
		return yield* Effect.forEach(rows, mapLine);
	});

export const parseStations = (dataDir: string) =>
	Effect.gen(function* () {
		const csv = yield* CsvService;
		const rows = yield* csv.parseFile(
			`${dataDir}/stations_with_english.csv`,
			StationCsvSchema,
		);
		return yield* Effect.forEach(rows, mapStation);
	});
