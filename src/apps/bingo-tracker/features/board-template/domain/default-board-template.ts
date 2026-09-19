import type { BoardTemplate } from "@/apps/bingo-tracker/features/board-template/domain/board-template";

export const DEFAULT_BOARD_TEMPLATE: Pick<
	BoardTemplate,
	"boardRange" | "grid"
> = {
	boardRange: {
		min: 1,
		max: 75,
	},
	grid: new Array(5)
		.fill(null)
		.map(() => new Array(5).fill(null).map(() => ({ type: "available" }))),
};
