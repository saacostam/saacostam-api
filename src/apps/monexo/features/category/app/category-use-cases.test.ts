import { beforeEach, describe, expect, it } from "vitest";
import { mockCategoryFactory } from "@/apps/monexo/features/category/test";
import { mockDiContext } from "@/apps/monexo/shared/di/test";
import { CategoryUseCases } from "./category-use-cases";

describe("CategoryUseCases", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: CategoryUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new CategoryUseCases(ctx);
	});

	describe("createCategory", () => {
		const cases = [
			{
				title: "uses provided description",
				input: {
					name: "name",
					description: "description",
					userId: "user-id",
				},
				expectedCreate: {
					id: "generated-id",
					name: "name",
					description: "description",
					ownership: {
						type: "private" as const,
						userId: "user-id",
					},
				},
			},
			{
				title: "defaults description to empty string",
				input: {
					name: "name",
					description: undefined,
					userId: "user-id",
				},
				expectedCreate: {
					id: "generated-id",
					name: "name",
					description: "",
					ownership: {
						type: "private" as const,
						userId: "user-id",
					},
				},
			},
		] as const;

		it.each(cases)("$title", async ({ input, expectedCreate }) => {
			ctx.prov.genId.gen.mockReturnValue(expectedCreate.id);

			const mockCategory = mockCategoryFactory.gen();
			ctx.repo.category.create.mockResolvedValue(mockCategory);

			const res = await useCases.createCategory(input);

			expect(res).toEqual({ id: mockCategory.id });

			expect(ctx.repo.category.create).toHaveBeenCalledExactlyOnceWith(
				expectedCreate,
			);
		});
	});

	describe("getCategories", () => {
		it("returns combined private and public categories when both succeed", async () => {
			const privateCategories = [
				mockCategoryFactory.gen(),
				mockCategoryFactory.gen(),
			];
			const publicCategories = [mockCategoryFactory.gen()];

			ctx.repo.category.getAllPrivate.mockResolvedValue(privateCategories);
			ctx.repo.category.getAllPublic.mockResolvedValue(publicCategories);

			const res = await useCases.getCategories({ userId: "user-id" });

			expect(res).toEqual([...privateCategories, ...publicCategories]);

			expect(ctx.repo.category.getAllPrivate).toHaveBeenCalledExactlyOnceWith(
				"user-id",
			);
			expect(ctx.repo.category.getAllPublic).toHaveBeenCalledOnce();
			expect(ctx.prov.errorLogger.log).not.toHaveBeenCalled();
		});

		it("returns only fulfilled results and logs error when one fails", async () => {
			const privateCategories = [mockCategoryFactory.gen()];
			const error = new Error("public failed");

			ctx.repo.category.getAllPrivate.mockResolvedValue(privateCategories);
			ctx.repo.category.getAllPublic.mockRejectedValue(error);

			const res = await useCases.getCategories({ userId: "user-id" });

			expect(res).toEqual(privateCategories);

			expect(ctx.prov.errorLogger.log).toHaveBeenCalledExactlyOnceWith(error, {
				where: "CategoriesUseCases.getCategories.categoriesFetching",
			});
		});

		it("returns empty array and logs both errors when both fail", async () => {
			const error1 = new Error("private failed");
			const error2 = new Error("public failed");

			ctx.repo.category.getAllPrivate.mockRejectedValue(error1);
			ctx.repo.category.getAllPublic.mockRejectedValue(error2);

			const res = await useCases.getCategories({ userId: "user-id" });

			expect(res).toEqual([]);

			expect(ctx.prov.errorLogger.log).toHaveBeenCalledTimes(2);
			expect(ctx.prov.errorLogger.log).toHaveBeenCalledWith(error1, {
				where: "CategoriesUseCases.getCategories.categoriesFetching",
			});
			expect(ctx.prov.errorLogger.log).toHaveBeenCalledWith(error2, {
				where: "CategoriesUseCases.getCategories.categoriesFetching",
			});
		});
	});
});
