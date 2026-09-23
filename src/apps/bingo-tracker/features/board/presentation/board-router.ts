import { Router } from "express";
import multer from "multer";
import { boardUseCases, withAuth } from "@/apps/bingo-tracker/shared/di/root";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { BoardValidator } from "./validators";

export const boardRouter = Router();

const upload = multer({
	storage: multer.memoryStorage(),
});

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

boardRouter.post(
	"/read/template/:boardTemplateId",
	upload.single("image"),
	withAuth(async (req, res) => {
		if (!req.file) {
			throw new BaseDomainError({
				type: DomainErrorType.BAD_REQUEST,
				message: "[BoardRouter.readFromFile] Image file was not provided",
				userMessage: "Image is required",
			});
		}

		const response = await boardUseCases.readFromFile({
			boardTemplateId: req.params.boardTemplateId,
			userId: req.user.userId,
			image: {
				name: req.file.originalname,
				mimeType: req.file.mimetype,
				size: req.file.size,
				data: req.file.buffer,
			},
		});

		res.status(200).json(response);
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
