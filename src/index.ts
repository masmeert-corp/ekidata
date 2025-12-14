import { BunRuntime } from "@effect/platform-bun";
import { Effect, Layer } from "effect";

import { schema } from "@/db";
import {
	parseCompanies,
	parseLines,
	parsePrefectures,
	parseRegions,
	parseStations,
} from "@/parsing/parsers";
import { deduplicateStations } from "@/parsing/stations";
import { CsvService } from "@/services/csv";
import { DrizzleService } from "@/services/drizzle";
import { KuroshiroService } from "@/services/kuroshiro";

const seed = Effect.gen(function* () {
	const db = yield* DrizzleService;

	yield* Effect.log("Clearing existing data...");
	yield* Effect.forEach(
		[
			schema.stationLine,
			schema.station,
			schema.line,
			schema.company,
			schema.prefecture,
			schema.region,
		],
		(table) => Effect.promise(() => db.delete(table)),
	);

	yield* Effect.log("Parsing and inserting regions...");
	const regionData = yield* parseRegions;
	yield* Effect.promise(() => db.insert(schema.region).values(regionData));

	yield* Effect.log("Parsing and inserting prefectures...");
	const prefectureData = yield* parsePrefectures;
	yield* Effect.promise(() =>
		db.insert(schema.prefecture).values(prefectureData),
	);

	yield* Effect.log("Parsing and inserting companies...");
	const companyData = yield* parseCompanies;
	yield* Effect.promise(() => db.insert(schema.company).values(companyData));

	yield* Effect.log("Parsing and inserting lines...");
	const lineData = yield* parseLines;
	yield* Effect.promise(() => db.insert(schema.line).values(lineData));

	yield* Effect.log("Parsing stations...");
	const allMapped = yield* parseStations;
	const validLineIds = new Set(lineData.map((l) => l.id));
	const { stations, stationLines } = yield* deduplicateStations(
		allMapped,
		validLineIds,
	);

	yield* Effect.log("Inserting stations...");
	yield* DrizzleService.insertBatched(schema.station, stations);

	yield* Effect.log("Inserting station-line relationships...");
	yield* DrizzleService.insertBatched(schema.stationLine, stationLines);

	yield* Effect.log("Seeding complete!");
});

const AllServices = Layer.mergeAll(
	CsvService.Default,
	KuroshiroService.Default,
	DrizzleService.Default,
);

BunRuntime.runMain(seed.pipe(Effect.provide(AllServices)));
