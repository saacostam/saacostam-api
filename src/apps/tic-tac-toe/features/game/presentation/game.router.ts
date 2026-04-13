import { Router } from "express";
import { gameUseCases } from "@/apps/tic-tac-toe/features/game/di-root";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { GameValidator } from "./game.validator";

export const gameRouter = Router();

const userIdNotFound = (ctx: string) =>
	new BaseDomainError({
		type: DomainErrorType.BAD_REQUEST,
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

gameRouter.post("/userId/:userId", async (req, res) => {
	const userId = req.params.userId;
	if (!userId) throw userIdNotFound("createGame");

	await gameUseCases.createGame(userId);
	res.status(201).json();
});

gameRouter.post("/:gameId/userId/:userId/turn", async (req, res) => {
	const userId = req.params.userId;
	if (!userId) throw userIdNotFound("sendTurn");

	const gameId = req.params.gameId;
	if (!gameId)
		throw new BaseDomainError({
			type: DomainErrorType.BAD_REQUEST,
			message: `[gameRouter.sendTurn] Game id not found`,
			userMessage: "Game ID is required but was not provided",
		});

	const payload = GameValidator.sendTurnValidator.parse(req.body);

	await gameUseCases.sendTurn({
		gameId,
		userId,
		x: payload.x,
		y: payload.y,
	});

	res.status(201).json();
});
