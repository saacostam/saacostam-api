import { Router } from "express";
import { gameUseCases } from "@/apps/tic-tac-toe/features/game/di-root";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export const gameRouter = Router();

const userIdNotFound = (ctx: string) =>
	new BaseDomainError({
		type: DomainErrorType.NOT_FOUND,
		message: `[gameRouter.${ctx}] User id not found`,
		userMessage: "User ID is required but was not provided",
	});

gameRouter.get("/", async (_, res) => {
	const result = await gameUseCases.queryOpenGames();
	res.status(200).json(result);
});

gameRouter.get("/userId/:userId", async (req, res) => {
	const userId = req.params.userId;
	if (!userId) throw userIdNotFound("queryUserGames");

	const result = await gameUseCases.queryUserGames(userId);
	res.status(200).json(result);
});
