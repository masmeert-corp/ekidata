import { FileSystem } from "@effect/platform";
import { BunFileSystem } from "@effect/platform-bun";
import { Data, Effect, Schema } from "effect";
import Papa from "papaparse";

export class CsvParseError extends Data.TaggedError("CsvParseError")<{
	readonly message: string;
	readonly row?: number;
}> {}

export class CsvFileNotFoundError extends Data.TaggedError(
	"CsvFileNotFoundError",
)<{
	readonly path: string;
}> {}

export class CsvValidationError extends Data.TaggedError("CsvValidationError")<{
	readonly message: string;
	readonly row: number;
	readonly data: unknown;
}> {}

class CsvService extends Effect.Service<CsvService>()("CsvService", {
	dependencies: [BunFileSystem.layer],
	effect: Effect.gen(function* () {
		const fs = yield* FileSystem.FileSystem;

		return {
			parseFile: <A, I>(path: string, schema: Schema.Schema<A, I>) =>
				Effect.gen(function* () {
					const content = yield* fs
						.readFileString(path)
						.pipe(Effect.mapError(() => new CsvFileNotFoundError({ path })));

					const result = Papa.parse(content, {
						header: true,
						skipEmptyLines: true,
						dynamicTyping: true,
					});

					const firstError = result.errors[0];
					if (firstError) {
						return yield* new CsvParseError({
							message: firstError.message,
							row: firstError.row,
						});
					}

					return yield* Effect.forEach(result.data, (row, index) =>
						Schema.decodeUnknown(schema)(row).pipe(
							Effect.mapError(
								(e) =>
									new CsvValidationError({
										message: e.message,
										row: index,
										data: row,
									}),
							),
						),
					);
				}),
		};
	}),
}) {}

export { CsvService };
