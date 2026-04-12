import { Router } from "express";
import type { Instance } from "express-ws";
import { userUseCases } from "@/apps/tic-tac-toe/features/user/di-root";
import { wsEventAdaper } from "@/apps/tic-tac-toe/shared/adapters/di-root";
import { IEventType } from "@/apps/tic-tac-toe/shared/adapters/domain";
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

		wsEventAdaper.addConnection(userId, ws);
		wsEventAdaper.publish(userId, IEventType.USER_ID, userId);

		ws.on("close", () => {
			wsEventAdaper.removeConnection(userId);
		});
	});

	return wsRouter;
};
