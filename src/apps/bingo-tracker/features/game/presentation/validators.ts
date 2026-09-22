import { z } from "zod";

const name = z.string().min(1).max(48);
const boardTemplateCell = z.object({
	type: z.enum(["blocked", "available"]),
});
const grid = z.array(z.array(boardTemplateCell));
const boardRange = z.object({
	min: z.number(),
	max: z.number(),
});

const create = z.object({
	name,
});
const setBoardTemplate = z.object({
	grid,
	boardRange,
});

export const GameValidator = {
	create,
	setBoardTemplate,
};
