import { Router } from "express";
import { expenseUseCases, withAuth } from "@/apps/monexo/shared/di/root";

export const expenseRouter = Router();

expenseRouter.get(
	"/",
	withAuth(async (req, res) => {
		const response = await expenseUseCases.getAll({
			userId: req.user.userId,
		});
		res.status(200).json(response);
	}),
);
