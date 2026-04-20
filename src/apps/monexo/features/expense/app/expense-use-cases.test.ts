import { beforeEach, describe, expect, it } from "vitest";
import type { IExpense } from "@/apps/monexo/features/expense/domain";
import { mockExpenseFactory } from "@/apps/monexo/features/expense/test";
import { mockDiContext } from "@/apps/monexo/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
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

	describe("update", () => {
		const baseExpense = mockExpenseFactory.gen({
			id: "exp-1",
			userId: "user-1",
			name: "old-name",
			description: "old-desc",
			amount: 100,
			date: 1,
			categoryId: "cat-1",
		});

		beforeEach(() => {
			ctx.repo.expense.getById.mockResolvedValue(baseExpense);
			ctx.repo.expense.update.mockImplementation(async (_id, e) => e);
		});

		it("throws if expense not found", async () => {
			ctx.repo.expense.getById.mockResolvedValue(null);

			await expect(
				useCases.update({ id: "exp-1", userId: "user-1" }),
			).rejects.toThrow(BaseDomainError);

			await expect(
				useCases.update({ id: "exp-1", userId: "user-1" }),
			).rejects.toMatchObject({
				type: DomainErrorType.NOT_FOUND,
			});
		});

		it("throws if user does not own expense", async () => {
			ctx.repo.expense.getById.mockResolvedValue({
				...baseExpense,
				userId: "other-user",
			});

			await expect(
				useCases.update({ id: "exp-1", userId: "user-1" }),
			).rejects.toThrow(BaseDomainError);

			await expect(
				useCases.update({ id: "exp-1", userId: "user-1" }),
			).rejects.toMatchObject({
				type: DomainErrorType.FORBIDDEN,
			});
		});

		type Case = {
			name: string;
			input: Partial<Parameters<ExpenseUseCases["update"]>[0]>;
			expected: Partial<IExpense>;
		};

		const cases: Case[] = [
			{
				name: "keeps all fields when no overrides provided",
				input: {},
				expected: {
					name: baseExpense.name,
					description: baseExpense.description,
					amount: baseExpense.amount,
					date: baseExpense.date,
					categoryId: baseExpense.categoryId,
				},
			},
			{
				name: "updates name",
				input: { name: "new-name" },
				expected: { name: "new-name" },
			},
			{
				name: "updates amount",
				input: { amount: 999 },
				expected: { amount: 999 },
			},
			{
				name: "updates date",
				input: { date: 999 },
				expected: { date: 999 },
			},
			{
				name: "updates categoryId",
				input: { categoryId: "cat-2" },
				expected: { categoryId: "cat-2" },
			},
			{
				name: "keeps categoryId when undefined",
				input: { categoryId: undefined },
				expected: { categoryId: baseExpense.categoryId },
			},
			{
				name: "sets categoryId to null when explicitly null",
				input: { categoryId: null },
				expected: { categoryId: null },
			},
			{
				name: "keeps description when undefined",
				input: { description: undefined },
				expected: { description: baseExpense.description },
			},
			{
				name: "normalizes description=null to empty string",
				input: { description: null },
				expected: { description: "" },
			},
			{
				name: "updates description when provided",
				input: { description: "new-desc" },
				expected: { description: "new-desc" },
			},
			{
				name: "updates multiple fields together",
				input: {
					name: "new",
					description: "new-desc",
					amount: 200,
					date: 2,
					categoryId: "cat-2",
				},
				expected: {
					name: "new",
					description: "new-desc",
					amount: 200,
					date: 2,
					categoryId: "cat-2",
				},
			},
		];

		it.each(cases)("$name", async ({ input, expected }) => {
			const res = await useCases.update({
				id: baseExpense.id,
				userId: baseExpense.userId,
				...input,
			});

			expect(ctx.repo.expense.update).toHaveBeenCalledExactlyOnceWith(
				baseExpense.id,
				{
					id: baseExpense.id,
					userId: baseExpense.userId,
					name:
						expected.name ??
						(input.name === undefined ? baseExpense.name : input.name),
					description:
						expected.description ??
						(input.description === null
							? ""
							: input.description === undefined
								? baseExpense.description
								: input.description),
					amount:
						expected.amount ??
						(input.amount === undefined ? baseExpense.amount : input.amount),
					date:
						expected.date ??
						(input.date === undefined ? baseExpense.date : input.date),
					categoryId:
						expected.categoryId ??
						(input.categoryId === undefined
							? baseExpense.categoryId
							: input.categoryId),
				},
			);

			expect(res).toEqual({ id: baseExpense.id });
		});
	});
});
