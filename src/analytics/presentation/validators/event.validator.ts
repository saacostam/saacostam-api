import { z } from "zod";

const createEventValidator = z.object({
	name: z.string().min(1).max(128),
	payload: z.string().min(0).max(2000),
});

export const EventValidator = {
	createEventValidator,
};
