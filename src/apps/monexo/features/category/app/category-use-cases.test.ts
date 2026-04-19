import { beforeEach, describe, expect, it } from "vitest";
import { mockCategoryFactory } from "@/apps/monexo/features/category/test";
import { mockDiContext } from "@/apps/monexo/shared/di/test";
import { DomainErrorType } from "@/shared/errors/domain";
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

	describe("getById", () => {
		it("throws not found error when category does not exist", async () => {
			ctx.repo.category.getById.mockResolvedValue(null);

			await expect(
				useCases.getById({ id: "category-id", userId: "user-id" }),
			).rejects.toMatchObject({
				type: DomainErrorType.NOT_FOUND,
			});

			expect(ctx.repo.category.getById).toHaveBeenCalledExactlyOnceWith(
				"category-id",
			);
		});

		it("throws forbidden when private category belongs to another user", async () => {
			const category = mockCategoryFactory.gen({
				ownership: {
					type: "private",
					userId: "other-user",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);

			await expect(
				useCases.getById({ id: category.id, userId: "user-id" }),
			).rejects.toMatchObject({
				type: DomainErrorType.FORBIDDEN,
			});
		});

		it("returns category when private and owned by user", async () => {
			const category = mockCategoryFactory.gen({
				ownership: {
					type: "private",
					userId: "user-id",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);

			const res = await useCases.getById({
				id: category.id,
				userId: "user-id",
			});

			expect(res).toEqual(category);
		});

		it("returns category when public", async () => {
			const category = mockCategoryFactory.gen({
				ownership: {
					type: "public",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);

			const res = await useCases.getById({
				id: category.id,
				userId: "any-user",
			});

			expect(res).toEqual(category);
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

	describe("remove", () => {
		it("throws not found error when category does not exist", async () => {
			ctx.repo.category.getById.mockResolvedValue(null);

			await expect(
				useCases.remove({ id: "category-id", userId: "user-id" }),
			).rejects.toMatchObject({
				type: DomainErrorType.NOT_FOUND,
			});

			expect(ctx.repo.category.delete).not.toHaveBeenCalled();
		});

		it("throws forbidden when private category belongs to another user", async () => {
			const category = mockCategoryFactory.gen({
				ownership: {
					type: "private",
					userId: "other-user",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);

			await expect(
				useCases.remove({ id: category.id, userId: "user-id" }),
			).rejects.toMatchObject({
				type: DomainErrorType.FORBIDDEN,
			});

			expect(ctx.repo.category.delete).not.toHaveBeenCalled();
		});

		it("allows deleting private category owned by user", async () => {
			const category = mockCategoryFactory.gen({
				ownership: {
					type: "private",
					userId: "user-id",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);
			ctx.repo.category.delete.mockResolvedValue(undefined);

			await expect(
				useCases.remove({ id: category.id, userId: "user-id" }),
			).resolves.toBeUndefined();

			expect(ctx.repo.category.delete).toHaveBeenCalledExactlyOnceWith(
				category.id,
			);
		});

		it("throws forbidden when deleting public category", async () => {
			const category = mockCategoryFactory.gen({
				ownership: {
					type: "public",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);

			await expect(
				useCases.remove({ id: category.id, userId: "user-id" }),
			).rejects.toMatchObject({
				type: DomainErrorType.FORBIDDEN,
			});

			expect(ctx.repo.category.delete).not.toHaveBeenCalled();
		});
	});

	describe("updateCategory", () => {
		it("throws not found error when category does not exist", async () => {
			ctx.repo.category.getById.mockResolvedValue(null);

			await expect(
				useCases.updateCategory({
					id: "category-id",
					userId: "user-id",
				}),
			).rejects.toMatchObject({
				type: DomainErrorType.NOT_FOUND,
			});

			expect(ctx.repo.category.updateCategory).not.toHaveBeenCalled();
		});

		it("throws forbidden when category is public", async () => {
			const category = mockCategoryFactory.gen({
				ownership: { type: "public" },
			});

			ctx.repo.category.getById.mockResolvedValue(category);

			await expect(
				useCases.updateCategory({
					id: category.id,
					userId: "user-id",
					name: "new-name",
				}),
			).rejects.toMatchObject({
				type: DomainErrorType.FORBIDDEN,
			});

			expect(ctx.repo.category.updateCategory).not.toHaveBeenCalled();
		});

		it("throws forbidden when private category belongs to another user", async () => {
			const category = mockCategoryFactory.gen({
				ownership: {
					type: "private",
					userId: "other-user",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);

			await expect(
				useCases.updateCategory({
					id: category.id,
					userId: "user-id",
					name: "new-name",
				}),
			).rejects.toMatchObject({
				type: DomainErrorType.FORBIDDEN,
			});

			expect(ctx.repo.category.updateCategory).not.toHaveBeenCalled();
		});

		it("updates name and description when provided", async () => {
			const category = mockCategoryFactory.gen({
				name: "old-name",
				description: "old-description",
				ownership: {
					type: "private",
					userId: "user-id",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);

			const updated = {
				...category,
				name: "new-name",
				description: "new-desc",
			};
			ctx.repo.category.updateCategory.mockResolvedValue(updated);

			const res = await useCases.updateCategory({
				id: category.id,
				userId: "user-id",
				name: "new-name",
				description: "new-desc",
			});

			expect(res).toEqual({ id: updated.id });

			expect(ctx.repo.category.updateCategory).toHaveBeenCalledExactlyOnceWith(
				category.id,
				{
					id: category.id,
					name: "new-name",
					description: "new-desc",
					ownership: category.ownership,
				},
			);
		});

		it("keeps existing values when name/description are undefined", async () => {
			const category = mockCategoryFactory.gen({
				name: "old-name",
				description: "old-description",
				ownership: {
					type: "private",
					userId: "user-id",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);
			ctx.repo.category.updateCategory.mockResolvedValue(category);

			await useCases.updateCategory({
				id: category.id,
				userId: "user-id",
			});

			expect(ctx.repo.category.updateCategory).toHaveBeenCalledExactlyOnceWith(
				category.id,
				{
					id: category.id,
					name: category.name,
					description: "", // because !description → ""
					ownership: category.ownership,
				},
			);
		});

		it("sets description to empty string when null or empty", async () => {
			const category = mockCategoryFactory.gen({
				description: "old-description",
				ownership: {
					type: "private",
					userId: "user-id",
				},
			});

			ctx.repo.category.getById.mockResolvedValue(category);
			ctx.repo.category.updateCategory.mockResolvedValue({
				...category,
				description: "",
			});

			await useCases.updateCategory({
				id: category.id,
				userId: "user-id",
				description: null,
			});

			expect(ctx.repo.category.updateCategory).toHaveBeenCalledWith(
				category.id,
				expect.objectContaining({
					description: "",
				}),
			);
		});
	});
});
