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
});
