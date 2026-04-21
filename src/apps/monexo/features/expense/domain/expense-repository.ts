import type { IExpense } from "./expense-entity";

/**
 * Data access abstraction over the expense entity.
 */
export interface IExpenseRepository {
	create(expense: IExpense): Promise<IExpense>;
	delete(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<IExpense[]>;
	/**
	 * Returns all expenses for a user within a half-open interval [start, end).
	 * Includes expenses where timestamp >= start and < end.
	 */
	getAllByUserIdInRange(
		args: IExpenseRepositoryPayload["GetAllByUserInRangeArgs"],
	): Promise<IExpense[]>;
	getById(id: string): Promise<IExpense | null>;
	update(id: string, expense: IExpense): Promise<IExpense>;
}

export interface IExpenseRepositoryPayload {
	GetAllByUserInRangeArgs: {
		userId: string;
		/** Inclusive lower bound (>= start) */
		start: number;
		/** Exclusive upper bound (< end) */
		end: number;
	};
}
