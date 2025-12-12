import { NumEnum } from "@/schemas/utils";

export const EntityStatus = NumEnum(
	["active", "pre_opening", "defunct"],
	"active",
);
export const CompanyType = NumEnum(
	["other", "jr", "major_private", "semi_major"],
	"other",
);
