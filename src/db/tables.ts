import {
	account,
	companiesTable,
	linesTable,
	prefecturesTable,
	regionsTable,
	session,
	stationsTable,
	user,
	verification,
} from "./schema";

export const table = {
	regions: regionsTable,
	prefectures: prefecturesTable,
	companies: companiesTable,
	lines: linesTable,
	stations: stationsTable,
	users: user,
	sessions: session,
	accounts: account,
	verifications: verification,
} as const;

export type Table = typeof table;
