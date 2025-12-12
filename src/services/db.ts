import { PgClient } from "@effect/sql-pg";
import { Config, Layer } from "effect";

import { EnvConfigLive } from "@/services/env";

export const PgLive = PgClient.layerConfig({
	url: Config.redacted("DATABASE_URL"),
}).pipe(Layer.provide(EnvConfigLive));
