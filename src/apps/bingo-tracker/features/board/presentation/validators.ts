import { z } from "zod";

const name = z.string().min(1).max(48);
const values = z.array(z.array(z.number().optional()));

const create = z.object({
	name,
	values,
});

const update = z.object({
	name,
	values,
});

export const BoardValidator = {
	create,
	update,
};
