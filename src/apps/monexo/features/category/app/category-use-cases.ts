import type { ICategory } from "@/apps/monexo/features/category/domain";
import type { IContext } from "@/apps/monexo/shared/di/app";

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
}
