import { z } from "zod";

const name = z.string().min(1).max(48);

const create = z.object({
	name: name,
});

export const GameValidator = {
	create,
};
