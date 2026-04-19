import { Router } from "express";
import { categoryUseCases, withAuth } from "@/apps/monexo/shared/di/root";
import { CategoryValidator } from "./validators";

export const categoryRouter = Router();

categoryRouter.get(
	"/",
	withAuth(async (req, res) => {
		const response = await categoryUseCases.getCategories({
			userId: req.user.userId,
		});
		res.status(200).json(response);
	}),
);

categoryRouter.post(
	"/",
	withAuth(async (req, res) => {
		const payload = CategoryValidator.createCategory.parse(req.body);

		const response = await categoryUseCases.createCategory({
			description: payload.description,
			name: payload.name,
			userId: req.user.userId,
		});
		res.status(201).json(response);
	}),
);
