import { Router } from "express";
import { gameUseCases, withAuth } from "@/apps/bingo-tracker/shared/di/root";
import { GameValidator } from "./validators";

export const gameRouter = Router();

gameRouter.delete(
	"/:gameId",
	withAuth(async (req, res) => {
		await gameUseCases.deleteGame({
			gameId: req.params.gameId,
			userId: req.user.userId,
		});

		res.status(204).send();
	}),
);

gameRouter.get(
	"/",
	withAuth(async (req, res) => {
		const games = await gameUseCases.getGames({ userId: req.user.userId });
		res.status(200).json(games);
	}),
);

gameRouter.post(
	"/",
	withAuth(async (req, res) => {
		const payload = GameValidator.create.parse(req.body);

		const response = await gameUseCases.createGame({
			name: payload.name,
			userId: req.user.userId,
		});

		res.status(201).json(response);
	}),
);

gameRouter.patch(
	"/:gameId/board-template",
	withAuth(async (req, res) => {
		const payload = GameValidator.setBoardTemplate.parse(req.body);

		await gameUseCases.setBoardTemplate({
			gameId: req.params.gameId,
			userId: req.user.userId,
			boardTemplate: {
				grid: payload.grid,
				boardRange: payload.boardRange,
			},
		});

		res.status(204).send();
	}),
);
