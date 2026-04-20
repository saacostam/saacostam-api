import { Router } from "express";
import { expenseUseCases, withAuth } from "@/apps/monexo/shared/di/root";
import { errorFactory } from "@/apps/monexo/shared/errors";
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

expenseRouter.put(
	"/:expenseId",
	withAuth(async (req, res) => {
		const expenseId = req.params.expenseId;
		if (!expenseId)
			throw errorFactory.fieldMissing({
				field: {
					detailedName: "Expense id",
					name: "expenseId",
				},
				ctx: "expenseRouter.put - update expense",
			});

		const payload = ExpenseValidator.updateExpense.parse(req.body);

		const response = await expenseUseCases.update({
			id: expenseId,
			userId: req.user.userId,

			amount: payload.amount,
			categoryId: payload.categoryId,
			date: payload.date,
			description: payload.description,
			name: payload.name,
		});
		res.status(200).json(response);
	}),
);
