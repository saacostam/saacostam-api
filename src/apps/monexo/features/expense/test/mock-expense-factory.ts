import type { IExpense } from "@/apps/monexo/features/expense/domain";

let privateId = 0;

export const mockExpenseFactory = {
	gen(override?: Partial<IExpense>): IExpense {
		privateId++;

		const id = String(privateId);

		return {
			id,
			name: `name-${id}`,
			description: `description-${id}`,
			amount: 300,
			date: 10_000,
			userId: "user-id",
			categoryId: "category-id",
			...override,
		};
	},
};
