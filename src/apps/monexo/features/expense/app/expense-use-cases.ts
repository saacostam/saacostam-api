import type { IExpense } from "@/apps/monexo/features/expense/domain";
import type { IContext } from "@/apps/monexo/shared/di/app";

export class ExpenseUseCases {
	constructor(private ctx: IContext) {}

	getAll(args: { userId: string }): Promise<IExpense[]> {
		return this.ctx.repo.expense.getAllByUserId(args.userId);
	}
}
