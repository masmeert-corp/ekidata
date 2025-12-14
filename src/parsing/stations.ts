import { Array as A, Effect, pipe } from "effect";

import type { StationMapped } from "@/parsing/mappers";
import type { StationDb, StationLineDb } from "@/schemas/station";

export type DeduplicatedStations = {
	stations: StationDb[];
	stationLines: StationLineDb[];
};

export const deduplicateStations = (
	mapped: StationMapped[],
	validLineIds: Set<number>,
) =>
	Effect.gen(function* () {
		const valid = mapped.filter((m) => validLineIds.has(m.stationLine.lineId));

		const stations = pipe(
			valid,
			A.map((m) => m.station),
			A.dedupeWith((a, b) => a.id === b.id),
		);

		const stationLines = pipe(
			valid,
			A.map((m) => m.stationLine),
			A.dedupeWith(
				(a, b) => a.stationId === b.stationId && a.lineId === b.lineId,
			),
		);

		const filtered = mapped.length - stationLines.length;

		yield* Effect.log(`Filtered ${filtered} with missing/duplicate lines`);
		yield* Effect.log(
			`Deduplicated to ${stations.length} stations, ${stationLines.length} station-line links`,
		);

		return { stations, stationLines } satisfies DeduplicatedStations;
	});
