import { z } from "zod";

const sendTurnValidator = z.object({
	x: z.number(),
	y: z.number(),
});

export const GameValidator = {
	sendTurnValidator,
};
