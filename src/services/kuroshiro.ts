import { Data, Effect } from "effect";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

export class KuroshiroInitError extends Data.TaggedError("KuroshiroInitError")<{
	readonly message: string;
}> {}

export class KuroshiroConvertError extends Data.TaggedError(
	"KuroshiroConvertError",
)<{
	readonly message: string;
	readonly input: string;
}> {}

// Convert options
export type ConvertTarget = "hiragana" | "katakana" | "romaji";
export type ConvertMode = "normal" | "spaced" | "okurigana" | "furigana";
export type RomajiSystem = "nippon" | "passport" | "hepburn";
export type ConvertOptions = {
	to: ConvertTarget;
	mode?: ConvertMode;
	romajiSystem?: RomajiSystem;
	delimiter_start?: string;
	delimiter_end?: string;
};

export class KuroshiroService extends Effect.Service<KuroshiroService>()(
	"KuroshiroService",
	{
		scoped: Effect.gen(function* () {
			const kuroshiro = new Kuroshiro();

			yield* Effect.tryPromise({
				try: () => kuroshiro.init(new KuromojiAnalyzer()),
				catch: (e) =>
					new KuroshiroInitError({
						message: e instanceof Error ? e.message : "Failed to initialize",
					}),
			});

			return {
				toHiragana: (text: string) =>
					Effect.tryPromise({
						try: () => kuroshiro.convert(text, { to: "hiragana" }),
						catch: (e) =>
							new KuroshiroConvertError({
								message: e instanceof Error ? e.message : "Failed to convert",
								input: text,
							}),
					}),

				toKatakana: (text: string) =>
					Effect.tryPromise({
						try: () => kuroshiro.convert(text, { to: "katakana" }),
						catch: (e) =>
							new KuroshiroConvertError({
								message: e instanceof Error ? e.message : "Failed to convert",
								input: text,
							}),
					}),

				toRomaji: (text: string, system: RomajiSystem = "hepburn") =>
					Effect.tryPromise({
						try: () =>
							kuroshiro.convert(text, { to: "romaji", romajiSystem: system }),
						catch: (e) =>
							new KuroshiroConvertError({
								message: e instanceof Error ? e.message : "Failed to convert",
								input: text,
							}),
					}),

				toFurigana: (text: string) =>
					Effect.tryPromise({
						try: () =>
							kuroshiro.convert(text, { to: "hiragana", mode: "furigana" }),
						catch: (e) =>
							new KuroshiroConvertError({
								message: e instanceof Error ? e.message : "Failed to convert",
								input: text,
							}),
					}),

				isJapanese: (text: string) => Kuroshiro.Util.isJapanese(text),
				hasHiragana: (text: string) => Kuroshiro.Util.hasHiragana(text),
				hasKatakana: (text: string) => Kuroshiro.Util.hasKatakana(text),
				hasKanji: (text: string) => Kuroshiro.Util.hasKanji(text),
			};
		}),
	},
) {}
