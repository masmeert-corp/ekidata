import { PlatformConfigProvider } from "@effect/platform";
import { BunFileSystem } from "@effect/platform-bun";
import { Layer } from "effect";

export const EnvConfigLive = PlatformConfigProvider.layerDotEnvAdd(".env").pipe(
	Layer.provide(BunFileSystem.layer),
);
