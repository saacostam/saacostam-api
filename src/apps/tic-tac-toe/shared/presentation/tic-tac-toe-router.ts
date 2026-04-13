import { Router } from "express";
import type { Instance } from "express-ws";
import { gameRouter } from "@/apps/tic-tac-toe/features/game/presentation";
import { wsRouterFactory } from "@/apps/tic-tac-toe/shared/adapters/presentation";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";

export const ticTacToeRouterFactory = (args: {
	expressWsInstance: Instance;
}) => {
	const ticTacToeRouter = Router();

	const wsRouter = wsRouterFactory({
		expressWsInstance: args.expressWsInstance,
	});
	ticTacToeRouter.use("/ws", wsRouter);

	ticTacToeRouter.use("/games", gameRouter);

	ticTacToeRouter.use(errorHandlerMiddleware);

	return ticTacToeRouter;
};
