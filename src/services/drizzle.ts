import * as DrizzlePg from "@effect/sql-drizzle/Pg";
import { getTableName } from "drizzle-orm";
import type { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { Array as A, Effect } from "effect";
import { BATCH_SIZE } from "@/config";
import { schema } from "@/db";
import { PgLive } from "@/services/db";

export class DrizzleService extends Effect.Service<DrizzleService>()(
	"DrizzleService",
	{
		dependencies: [PgLive],
		effect: DrizzlePg.make<typeof schema>({ schema }),
	},
) {
	static insertBatched<T extends TableConfig>(
		table: PgTable<T>,
		data: PgTable<T>["$inferInsert"][],
	) {
		return Effect.gen(function* () {
			const db = yield* DrizzleService;
			const batches = A.chunksOf(data, BATCH_SIZE);
			yield* Effect.forEach(batches, (batch) =>
				Effect.promise(() => db.insert(table).values(batch)),
			);
			yield* Effect.log(
				`Inserted ${data.length} rows into ${getTableName(table)}`,
			);
		});
	}
}
