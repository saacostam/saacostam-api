import { z } from "zod";

const name = z.string().min(1).max(48);
const takenNumbers = z.array(z.number());
const pattern = z.array(z.array(z.boolean()));
const patterns = z.array(pattern);

const create = z.object({
	name,
});
const takeNumber = z.object({
	takenNumbers,
});
const updatePatterns = z.object({
	patterns,
});

export const PlayValidator = {
	create,
	takeNumber,
	updatePatterns,
};
