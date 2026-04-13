import { Router } from "express";
import type { Instance } from "express-ws";
import { IEventType } from "@/apps/tic-tac-toe/shared/adapters/domain";
import {
	userUseCases,
	wsEventAdapter,
} from "@/apps/tic-tac-toe/shared/di-root";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export const wsRouterFactory = (args: { expressWsInstance: Instance }) => {
	const wsRouter = Router();
	args.expressWsInstance.applyTo(wsRouter);

	wsRouter.ws("/:name", async (ws, req) => {
		const name = req.params.name;
		if (!name)
			throw new BaseDomainError(
				{
					type: DomainErrorType.BAD_REQUEST,
					userMessage: "Name field is required",
					message: "[App.Ws] NAME_FIELD_NOT_FOUND_ERROR",
				},
				[
					{
						field: "name",
						message: "required",
					},
				],
			);

		const userId = await userUseCases.addUser({
			name,
		});

		wsEventAdapter.addConnection(userId, ws);
		wsEventAdapter.publish(userId, IEventType.USER_ID, userId);

		ws.on("close", () => {
			void userUseCases.removeUser(userId);
			wsEventAdapter.removeConnection(userId);
		});
	});

	return wsRouter;
};
