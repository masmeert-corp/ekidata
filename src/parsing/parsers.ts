import { Effect } from "effect";

import { CSV_FILES, DATA_DIR } from "@/config";
import { mapCompany, mapLine, mapStation } from "@/parsing/mappers";
import { CompanyCsvSchema } from "@/schemas/company";
import { LineCsvSchema } from "@/schemas/line";
import { PrefectureTransform } from "@/schemas/prefecture";
import { RegionTransform } from "@/schemas/region";
import { StationCsvSchema } from "@/schemas/station";
import { CsvService } from "@/services/csv";

const csvPath = (file: string) => `${DATA_DIR}/${file}`;

export const parseRegions = Effect.gen(function* () {
	const csv = yield* CsvService;
	return yield* csv.parseFile(csvPath(CSV_FILES.regions), RegionTransform);
});

export const parsePrefectures = Effect.gen(function* () {
	const csv = yield* CsvService;
	return yield* csv.parseFile(
		csvPath(CSV_FILES.prefectures),
		PrefectureTransform,
	);
});

export const parseCompanies = Effect.gen(function* () {
	const csv = yield* CsvService;
	const rows = yield* csv.parseFile(
		csvPath(CSV_FILES.companies),
		CompanyCsvSchema,
	);
	return yield* Effect.forEach(rows, mapCompany);
});

export const parseLines = Effect.gen(function* () {
	const csv = yield* CsvService;
	const rows = yield* csv.parseFile(csvPath(CSV_FILES.lines), LineCsvSchema);
	return yield* Effect.forEach(rows, mapLine);
});

export const parseStations = Effect.gen(function* () {
	const csv = yield* CsvService;
	const rows = yield* csv.parseFile(
		csvPath(CSV_FILES.stations),
		StationCsvSchema,
	);
	return yield* Effect.forEach(rows, mapStation);
});
