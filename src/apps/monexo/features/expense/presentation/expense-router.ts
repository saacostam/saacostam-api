import { Router } from "express";
import { expenseUseCases, withAuth } from "@/apps/monexo/shared/di/root";
import { ExpenseValidator } from "./validators";

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

expenseRouter.post(
	"/",
	withAuth(async (req, res) => {
		const payload = ExpenseValidator.createExpense.parse(req.body);

		const response = await expenseUseCases.create({
			amount: payload.amount,
			categoryId: payload.categoryId,
			date: payload.date,
			description: payload.description,
			name: payload.name,
			userId: req.user.userId,
		});
		res.status(201).json(response);
	}),
);
