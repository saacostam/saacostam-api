import type { IExpense } from "./expense-entity";

/**
 * Data access abstraction over the expense entity.
 */
export interface IExpenseRepository {
	create(expense: IExpense): Promise<IExpense>;
	delete(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<IExpense[]>;
	getById(id: string): Promise<IExpense | null>;
	update(id: string, expense: IExpense): Promise<IExpense>;
}
