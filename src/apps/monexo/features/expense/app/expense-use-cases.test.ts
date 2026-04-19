import { beforeEach, describe, expect, it } from "vitest";
import { mockExpenseFactory } from "@/apps/monexo/features/expense/test";
import { mockDiContext } from "@/apps/monexo/shared/di/test";
import { ExpenseUseCases } from "./expense-use-cases";

describe("ExpenseUseCases", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: ExpenseUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new ExpenseUseCases(ctx);
	});

	describe("getAll", () => {
		it("returns expenses by user id", async () => {
			const expenses = [mockExpenseFactory.gen(), mockExpenseFactory.gen()];

			ctx.repo.expense.getAllByUserId.mockResolvedValue(expenses);

			const mockUserId = "user-id";
			const res = await useCases.getAll({ userId: mockUserId });

			expect(res).toEqual(expenses);
			expect(ctx.repo.expense.getAllByUserId).toHaveBeenCalledExactlyOnceWith(
				mockUserId,
			);
		});
	});
});
