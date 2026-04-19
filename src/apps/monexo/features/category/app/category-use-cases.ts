import type { ICategory } from "@/apps/monexo/features/category/domain";
import type { IContext } from "@/apps/monexo/shared/di/app";
import { errorFactory } from "@/apps/monexo/shared/errors";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class CategoryUseCases {
	constructor(private ctx: IContext) {}

	async createCategory(args: {
		description?: string | null;
		name: string;
		userId: string;
	}): Promise<{ id: string }> {
		const { description, name, userId } = args;

		const category: ICategory = {
			id: this.ctx.prov.genId.gen(),
			description: description || "",
			name,
			ownership: {
				type: "private",
				userId,
			},
		};

		const newCategory = await this.ctx.repo.category.create(category);

		return {
			id: newCategory.id,
		};
	}

	async getById(args: { id: string; userId: string }): Promise<ICategory> {
		const { id, userId } = args;

		const category = await this.ctx.repo.category.getById(id);

		if (!category)
			throw errorFactory.categoryByIdNotFound({
				id,
				ctx: "CategoryUseCases.getById",
			});

		if (
			category.ownership.type === "private" &&
			category.ownership.userId !== userId
		) {
			throw new BaseDomainError({
				type: DomainErrorType.FORBIDDEN,
				message: `[CategoryUseCases.getById] Forbidden: user=${userId}, category=${id}`,
				userMessage: "Insufficient permissions to view this category",
			});
		}

		return category;
	}

	async getCategories(args: { userId: string }): Promise<ICategory[]> {
		const categoriesFetching = await Promise.allSettled([
			this.ctx.repo.category.getAllPrivate(args.userId),
			this.ctx.repo.category.getAllPublic(),
		]);

		const categories: ICategory[] = [];

		categoriesFetching.forEach((result) => {
			if (result.status === "fulfilled") {
				categories.push(...result.value);
			} else {
				this.ctx.prov.errorLogger.log(result.reason, {
					where: "CategoriesUseCases.getCategories.categoriesFetching",
				});
			}
		});

		return categories;
	}

	async remove(args: { id: string; userId: string }): Promise<void> {
		const { id, userId } = args;

		const category = await this.ctx.repo.category.getById(id);

		if (!category)
			throw errorFactory.categoryByIdNotFound({
				id,
				ctx: "CategoryUseCases.remove",
			});

		if (
			category.ownership.type === "public" ||
			category.ownership.userId !== userId
		) {
			throw new BaseDomainError({
				type: DomainErrorType.FORBIDDEN,
				message: `[CategoryUseCases.remove] Forbidden: user=${userId}, category=${id}`,
				userMessage: "Insufficient permissions to delete this category",
			});
		}

		await this.ctx.repo.category.delete(category.id);
	}

	async updateCategory(args: {
		id: string;
		userId: string;
		description?: string | null;
		name?: string;
	}): Promise<{ id: string }> {
		const { id, userId, description, name } = args;

		const category = await this.ctx.repo.category.getById(id);

		if (!category) {
			throw errorFactory.categoryByIdNotFound({
				id,
				ctx: "CategoryUseCases.updateCategory",
			});
		}

		if (
			category.ownership.type === "public" ||
			category.ownership.userId !== userId
		) {
			throw new BaseDomainError({
				type: DomainErrorType.FORBIDDEN,
				message: `[CategoryUseCases.updateCategory] Forbidden: user=${userId}, category=${id}`,
				userMessage: "Insufficient permissions to update this category",
			});
		}

		const newCategory: ICategory = {
			id: category.id,
			name: name ?? category.name,
			description: !description ? "" : (description ?? category.description),
			ownership: category.ownership,
		};

		const updatedCategory = await this.ctx.repo.category.updateCategory(
			id,
			newCategory,
		);

		return {
			id: updatedCategory.id,
		};
	}
}
