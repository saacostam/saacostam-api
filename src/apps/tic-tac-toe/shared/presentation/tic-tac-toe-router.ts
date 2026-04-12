import { Router } from "express";
import type { Instance } from "express-ws";
import { wsRouterFactory } from "@/apps/tic-tac-toe/shared/adapters/presentation";

export const ticTacToeRouterFactory = (args: {
	expressWsInstance: Instance;
}) => {
	const ticTacToeRouter = Router();

	const wsRouter = wsRouterFactory({
		expressWsInstance: args.expressWsInstance,
	});
	ticTacToeRouter.use("/ws", wsRouter);

	return ticTacToeRouter;
};
