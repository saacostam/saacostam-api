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

	describe("create (table-driven)", () => {
		const baseArgs = {
			name: "Test",
			amount: 100,
			date: 123,
			userId: "user-1",
		};

		type Case = {
			name: string;
			input: Partial<Parameters<ExpenseUseCases["create"]>[0]>;
			expected: {
				description: string;
				categoryId: string | null;
			};
		};

		const cases: Case[] = [
			{
				name: "defaults description and categoryId when omitted",
				input: {},
				expected: { description: "", categoryId: null },
			},
			{
				name: "normalizes description=null to empty string",
				input: { description: null },
				expected: { description: "", categoryId: null },
			},
			{
				name: "keeps provided description",
				input: { description: "desc" },
				expected: { description: "desc", categoryId: null },
			},
			{
				name: "sets categoryId=null when explicitly null",
				input: { categoryId: null },
				expected: { description: "", categoryId: null },
			},
			{
				name: "keeps provided categoryId",
				input: { categoryId: "cat-1" },
				expected: { description: "", categoryId: "cat-1" },
			},
			{
				name: "handles both description and categoryId provided",
				input: { description: "desc", categoryId: "cat-1" },
				expected: { description: "desc", categoryId: "cat-1" },
			},
		];

		it.each(cases)("$name", async ({ input, expected }) => {
			const generatedId = "exp-1";

			ctx.prov.genId.gen.mockReturnValue(generatedId);
			ctx.repo.expense.create.mockImplementation(async (e) => e);

			const res = await useCases.create({
				...baseArgs,
				...input,
			});

			expect(ctx.prov.genId.gen).toHaveBeenCalledExactlyOnceWith();

			expect(ctx.repo.expense.create).toHaveBeenCalledExactlyOnceWith({
				id: generatedId,
				name: baseArgs.name,
				description: expected.description,
				amount: baseArgs.amount,
				date: baseArgs.date,
				userId: baseArgs.userId,
				categoryId: expected.categoryId,
			});

			expect(res).toEqual({ id: generatedId });
		});
	});

	describe("getAll", () => {
		it("returns expenses enriched with categories", async () => {
			const expenses = [
				mockExpenseFactory.gen({ categoryId: "c1" }),
				mockExpenseFactory.gen({ categoryId: "c2" }),
			];

			const categories = [
				{ id: "c1", name: "Cat 1" },
				{ id: "c2", name: "Cat 2" },
			];

			ctx.repo.expense.getAllByUserId.mockResolvedValue(expenses);
			ctx.repo.category.getAllByIdList.mockResolvedValue(categories);

			const res = await useCases.getAll({ userId: "user-id" });

			expect(res).toEqual([
				{ ...expenses[0], category: categories[0] },
				{ ...expenses[1], category: categories[1] },
			]);

			expect(ctx.repo.expense.getAllByUserId).toHaveBeenCalledExactlyOnceWith(
				"user-id",
			);

			expect(ctx.repo.category.getAllByIdList).toHaveBeenCalledExactlyOnceWith([
				"c1",
				"c2",
			]);
		});

		it("sets category to null when not found", async () => {
			const expenses = [mockExpenseFactory.gen({ categoryId: "c1" })];

			ctx.repo.expense.getAllByUserId.mockResolvedValue(expenses);
			ctx.repo.category.getAllByIdList.mockResolvedValue([]); // none found

			const res = await useCases.getAll({ userId: "user-id" });

			expect(res).toEqual([{ ...expenses[0], category: null }]);
		});

		it("deduplicates category ids before querying", async () => {
			const expenses = [
				mockExpenseFactory.gen({ categoryId: "c1" }),
				mockExpenseFactory.gen({ categoryId: "c1" }),
			];

			const categories = [{ id: "c1", name: "Cat 1" }];

			ctx.repo.expense.getAllByUserId.mockResolvedValue(expenses);
			ctx.repo.category.getAllByIdList.mockResolvedValue(categories);

			await useCases.getAll({ userId: "user-id" });

			expect(ctx.repo.category.getAllByIdList).toHaveBeenCalledExactlyOnceWith([
				"c1",
			]);
		});

		it("ignores falsy category ids", async () => {
			const expenses = [
				mockExpenseFactory.gen({ categoryId: "c1" }),
				mockExpenseFactory.gen({ categoryId: null }),
				mockExpenseFactory.gen({ categoryId: undefined }),
			];

			const categories = [{ id: "c1", name: "Cat 1" }];

			ctx.repo.expense.getAllByUserId.mockResolvedValue(expenses);
			ctx.repo.category.getAllByIdList.mockResolvedValue(categories);

			await useCases.getAll({ userId: "user-id" });

			expect(ctx.repo.category.getAllByIdList).toHaveBeenCalledExactlyOnceWith([
				"c1",
			]);
		});
	});
});
