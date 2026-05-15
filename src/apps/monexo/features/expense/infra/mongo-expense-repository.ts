import type { Collection } from "mongodb";
import type {
	IExpense,
	IExpenseRepository,
	IExpenseRepositoryPayload,
} from "@/apps/monexo/features/expense/domain";
import { monexoDb } from "@/apps/monexo/shared/mongo";

interface ExpenseDocument {
	_id: string;
	name: string;
	description: string;
	amount: number;
	date: number;
	userId: string;
	categoryId: string | null;
}

const expensesCollection: Collection<ExpenseDocument> =
	monexoDb.collection("expenses");

export class MongoExpenseRepository implements IExpenseRepository {
	async create(expense: IExpense): Promise<IExpense> {
		await expensesCollection.insertOne({
			_id: expense.id,
			name: expense.name,
			description: expense.description,
			amount: expense.amount,
			date: expense.date,
			userId: expense.userId,
			categoryId: expense.categoryId,
		});

		return expense;
	}

	async delete(id: string): Promise<void> {
		await expensesCollection.deleteOne({
			_id: id,
		});
	}

	async getAllByUserId(userId: string): Promise<IExpense[]> {
		const expenses = await expensesCollection
			.find({
				userId,
			})
			.toArray();

		return expenses.map(this.mapToDomain);
	}

	async getAllByUserIdInRange(
		args: IExpenseRepositoryPayload["GetAllByUserInRangeArgs"],
	): Promise<IExpense[]> {
		const { userId, start, end } = args;

		const expenses = await expensesCollection
			.find({
				userId,
				date: {
					$gte: start,
					$lt: end,
				},
			})
			.toArray();

		return expenses.map(this.mapToDomain);
	}

	async getById(id: string): Promise<IExpense | null> {
		const expense = await expensesCollection.findOne({
			_id: id,
		});

		if (expense === null) return null;

		return this.mapToDomain(expense);
	}

	async update(id: string, expense: IExpense): Promise<IExpense> {
		await expensesCollection.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					name: expense.name,
					description: expense.description,
					amount: expense.amount,
					date: expense.date,
					userId: expense.userId,
					categoryId: expense.categoryId,
				},
			},
		);

		return expense;
	}

	private mapToDomain(expense: ExpenseDocument): IExpense {
		return {
			id: expense._id,
			name: expense.name,
			description: expense.description,
			amount: expense.amount,
			date: expense.date,
			userId: expense.userId,
			categoryId: expense.categoryId,
		};
	}
}
