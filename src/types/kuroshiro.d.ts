declare module "kuroshiro" {
	export interface ConvertOptions {
		to: "hiragana" | "katakana" | "romaji";
		mode?: "normal" | "spaced" | "okurigana" | "furigana";
		romajiSystem?: "nippon" | "passport" | "hepburn";
		delimiter_start?: string;
		delimiter_end?: string;
	}

	export interface Analyzer {
		init(): Promise<void>;
	}

	export default class Kuroshiro {
		init(analyzer: Analyzer): Promise<void>;
		convert(text: string, options: ConvertOptions): Promise<string>;

		static Util: {
			isHiragana(char: string): boolean;
			isKatakana(char: string): boolean;
			isKana(char: string): boolean;
			isKanji(char: string): boolean;
			isJapanese(char: string): boolean;
			hasHiragana(text: string): boolean;
			hasKatakana(text: string): boolean;
			hasKana(text: string): boolean;
			hasKanji(text: string): boolean;
			hasJapanese(text: string): boolean;
			kanaToHiragana(text: string): string;
			kanaToKatakana(text: string): string;
			kanaToRomaji(text: string, system?: string): string;
		};
	}
}

declare module "kuroshiro-analyzer-kuromoji" {
	import type { Analyzer } from "kuroshiro";

	export interface KuromojiAnalyzerOptions {
		dictPath?: string;
	}

	export default class KuromojiAnalyzer implements Analyzer {
		constructor(options?: KuromojiAnalyzerOptions);
		init(): Promise<void>;
	}
}
