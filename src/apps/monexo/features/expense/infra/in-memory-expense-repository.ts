import type {
	IExpense,
	IExpenseRepository,
} from "@/apps/monexo/features/expense/domain";

export class InMemoryExpenseRepository implements IExpenseRepository {
	private expenses: IExpense[] = [];

	async create(expense: IExpense): Promise<IExpense> {
		this.expenses.push(expense);

		return expense;
	}

	async delete(id: string): Promise<void> {
		this.expenses = this.expenses.filter((e) => e.id !== id);
	}

	async getAllByUserId(userId: string): Promise<IExpense[]> {
		return this.expenses.filter((e) => e.userId === userId);
	}

	async getById(id: string): Promise<IExpense | null> {
		return this.expenses.find((e) => e.id === id) ?? null;
	}

	async update(id: string, expense: IExpense): Promise<IExpense> {
		this.expenses = this.expenses.map((e) => (e.id === id ? expense : e));

		return expense;
	}
}
