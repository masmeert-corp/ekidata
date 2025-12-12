import { BunRuntime } from "@effect/platform-bun";
import { Effect, Layer } from "effect";
import { table } from "@/db/tables";
import {
	parseCompanies,
	parseLines,
	parsePrefectures,
	parseRegions,
	parseStations,
} from "@/parsing/parsers";
import { CsvService } from "@/services/csv";
import { DrizzleService } from "@/services/drizzle";
import { KuroshiroService } from "@/services/kuroshiro";

const seed = Effect.gen(function* () {
	const db = yield* DrizzleService;
	const dir = "./data";

	yield* Effect.log("Parsing regions...");
	const regionData = yield* parseRegions(dir);
	yield* Effect.promise(() => db.insert(table.regions).values(regionData));
	yield* Effect.log(`Inserted ${regionData.length} regions`);

	yield* Effect.log("Parsing prefectures...");
	const prefectureData = yield* parsePrefectures(dir);
	yield* Effect.promise(() =>
		db.insert(table.prefectures).values(prefectureData),
	);
	yield* Effect.log(`Inserted ${prefectureData.length} prefectures`);

	yield* Effect.log("Parsing companies...");
	const companyData = yield* parseCompanies(dir);
	yield* Effect.promise(() => db.insert(table.companies).values(companyData));
	yield* Effect.log(`Inserted ${companyData.length} companies`);

	yield* Effect.log("Parsing lines...");
	const lineData = yield* parseLines(dir);
	yield* Effect.promise(() => db.insert(table.lines).values(lineData));
	yield* Effect.log(`Inserted ${lineData.length} lines`);

	yield* Effect.log("Parsing stations...");
	const stationData = yield* parseStations(dir);
	const batchSize = 1000;
	for (let i = 0; i < stationData.length; i += batchSize) {
		const batch = stationData.slice(i, i + batchSize);
		yield* Effect.promise(() => db.insert(table.stations).values(batch));
		yield* Effect.log(
			`Inserted ${Math.min(i + batchSize, stationData.length)}/${stationData.length} stations`,
		);
	}

	yield* Effect.log("Seeding complete!");
});

const AllServices = Layer.mergeAll(
	CsvService.Default,
	KuroshiroService.Default,
	DrizzleService.Default,
);

BunRuntime.runMain(seed.pipe(Effect.provide(AllServices)));
