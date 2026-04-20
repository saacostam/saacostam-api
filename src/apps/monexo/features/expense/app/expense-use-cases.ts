import type {
	IExpense,
	IWithCategory,
} from "@/apps/monexo/features/expense/domain";
import type { IContext } from "@/apps/monexo/shared/di/app";
import { errorFactory } from "@/apps/monexo/shared/errors";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class ExpenseUseCases {
	constructor(private ctx: IContext) {}

	async create(args: {
		name: string;
		description?: string | null;
		amount: number;
		date: number;
		userId: string;
		categoryId?: string | null;
	}): Promise<{ id: string }> {
		const { name, description, amount, date, userId, categoryId } = args;

		const expense: IExpense = {
			id: this.ctx.prov.genId.gen(),
			name,
			description: description ?? "",
			amount,
			date,
			userId,
			categoryId: categoryId ?? null,
		};

		const newExpense = await this.ctx.repo.expense.create(expense);

		return {
			id: newExpense.id,
		};
	}

	async getAll(args: { userId: string }): Promise<IWithCategory<IExpense>[]> {
		const expenses = await this.ctx.repo.expense.getAllByUserId(args.userId);

		const categoriesIds = Array.from(
			new Set(expenses.map((e) => e.categoryId)),
		).reduce((categoriesIds: string[], id) => {
			if (id) categoriesIds.push(id);
			return categoriesIds;
		}, []);

		const categories =
			await this.ctx.repo.category.getAllByIdList(categoriesIds);

		return expenses.map((e) => {
			const category = categories.find((c) => c.id === e.categoryId);

			return {
				...e,
				category: category ?? null,
			};
		});
	}

	async update(args: {
		id: string;
		userId: string;

		name?: string;
		description?: string | null;
		amount?: number;
		date?: number;
		categoryId?: string | null;
	}): Promise<{ id: string }> {
		const { id, userId, name, description, amount, date, categoryId } = args;

		const expense = await this.ctx.repo.expense.getById(id);

		if (!expense)
			throw errorFactory.expenseByIdNotFound({
				id,
				ctx: "ExpenseUseCases.update",
			});

		if (expense.userId !== userId) {
			throw new BaseDomainError({
				type: DomainErrorType.FORBIDDEN,
				message: `[ExpenseUseCases.update] Forbidden: user=${userId}, expense=${id}`,
				userMessage: "Insufficient permissions to update this expense",
			});
		}

		const newExpense: IExpense = {
			id: expense.id,
			userId: expense.userId,
			name: name === undefined ? expense.name : name,
			description:
				description === null
					? ""
					: description === undefined
						? expense.description
						: description,
			amount: amount === undefined ? expense.amount : amount,
			date: date === undefined ? expense.date : date,
			categoryId: categoryId === undefined ? expense.categoryId : categoryId,
		};
		const updatedExpense = await this.ctx.repo.expense.update(id, newExpense);

		return {
			id: updatedExpense.id,
		};
	}
}
