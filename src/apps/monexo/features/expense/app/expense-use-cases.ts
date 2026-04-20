import type {
	IExpense,
	IWithCategory,
} from "@/apps/monexo/features/expense/domain";
import type { IContext } from "@/apps/monexo/shared/di/app";

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
}
