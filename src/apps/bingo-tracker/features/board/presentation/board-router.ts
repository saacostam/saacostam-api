import { Router } from "express";
import { boardUseCases, withAuth } from "@/apps/bingo-tracker/shared/di/root";
import { BoardValidator } from "./validators";

export const boardRouter = Router();

boardRouter.post(
	"/:gameId",
	withAuth(async (req, res) => {
		const payload = BoardValidator.create.parse(req.body);

		const response = await boardUseCases.create({
			gameId: req.params.gameId,
			name: payload.name,
			userId: req.user.userId,
			values: payload.values,
		});

		res.status(201).json(response);
	}),
);

boardRouter.get(
	"/:boardId",
	withAuth(async (req, res) => {
		const response = await boardUseCases.getById({
			boardId: req.params.boardId,
			userId: req.user.userId,
		});

		res.status(200).json(response);
	}),
);

boardRouter.patch(
	"/:boardId",
	withAuth(async (req, res) => {
		const payload = BoardValidator.update.parse(req.body);

		await boardUseCases.update({
			boardId: req.params.boardId,
			userId: req.user.userId,
			board: {
				name: payload.name,
				values: payload.values,
			},
		});

		res.status(204).send();
	}),
);

boardRouter.delete(
	"/:boardId",
	withAuth(async (req, res) => {
		await boardUseCases.delete({
			boardId: req.params.boardId,
			userId: req.user.userId,
		});

		res.status(204).send();
	}),
);
