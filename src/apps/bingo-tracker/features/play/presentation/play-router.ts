import { Router } from "express";
import { playUseCases, withAuth } from "@/apps/bingo-tracker/shared/di/root";
import { PlayValidator } from "./validators";

export const playRouter = Router();

playRouter.post(
	"/:gameId",
	withAuth(async (req, res) => {
		const payload = PlayValidator.create.parse(req.body);

		const response = await playUseCases.create({
			gameId: req.params.gameId,
			userId: req.user.userId,
			name: payload.name,
		});

		res.status(201).json(response);
	}),
);

playRouter.get(
	"/game/:gameId",
	withAuth(async (req, res) => {
		const response = await playUseCases.getAllByGameId({
			gameId: req.params.gameId,
			userId: req.user.userId,
		});

		res.status(200).json(response);
	}),
);

playRouter.get(
	"/:playId",
	withAuth(async (req, res) => {
		const response = await playUseCases.getById({
			playId: req.params.playId,
			userId: req.user.userId,
		});

		res.status(200).json(response);
	}),
);

playRouter.patch(
	"/:playId/taken-numbers",
	withAuth(async (req, res) => {
		const payload = PlayValidator.takeNumber.parse(req.body);

		await playUseCases.takeNumber({
			playId: req.params.playId,
			userId: req.user.userId,
			takenNumbers: payload.takenNumbers,
		});

		res.status(204).send();
	}),
);

playRouter.patch(
	"/:playId/patterns",
	withAuth(async (req, res) => {
		const payload = PlayValidator.updatePatterns.parse(req.body);

		await playUseCases.updatePatterns({
			playId: req.params.playId,
			userId: req.user.userId,
			patterns: payload.patterns,
		});

		res.status(204).send();
	}),
);
