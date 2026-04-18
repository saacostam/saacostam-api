import type {
	ICategory,
	ICategoryRepository,
} from "@/apps/monexo/features/category/domain";

export class InMemoryCategoryRepository implements ICategoryRepository {
	private categories: ICategory[] = [];

	async create(category: ICategory): Promise<ICategory> {
		this.categories.push(category);

		return category;
	}

	async delete(id: string): Promise<void> {
		this.categories = this.categories.filter((c) => c.id !== id);
	}

	async getAllPublic(): Promise<ICategory[]> {
		return this.categories.filter((c) => c.ownership.type === "public");
	}

	async getAllPrivate(userId: string): Promise<ICategory[]> {
		return this.categories.filter(
			(c) => c.ownership.type === "private" && c.ownership.userId === userId,
		);
	}

	async updateCategory(id: string, category: ICategory): Promise<ICategory> {
		this.categories = this.categories.map((c) => (c.id === id ? category : c));

		return category;
	}
}
