import { z } from "zod";

const createEventValidator = z.object({
	name: z.string().min(1).max(128),
	payload: z.string().max(2000).nullable().optional(),
});

export const EventValidator = {
	createEventValidator,
};
