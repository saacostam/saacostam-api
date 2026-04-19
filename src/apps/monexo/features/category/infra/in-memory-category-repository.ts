import type {
	ICategory,
	ICategoryRepository,
} from "@/apps/monexo/features/category/domain";

export class InMemoryCategoryRepository implements ICategoryRepository {
	private categories: ICategory[] = [
		{
			id: "1",
			name: "Housing",
			description: "Rent, mortgage, home expenses",
			ownership: { type: "public" },
		},
		{
			id: "2",
			name: "Food",
			description: "Groceries, restaurants, meals",
			ownership: { type: "public" },
		},
		{
			id: "3",
			name: "Transport",
			description: "Public transport, fuel, taxi",
			ownership: { type: "public" },
		},
		{
			id: "4",
			name: "Utilities",
			description: "Electricity, water, internet",
			ownership: { type: "public" },
		},
		{
			id: "5",
			name: "Entertainment",
			description: "Movies, games, subscriptions",
			ownership: { type: "public" },
		},
		{
			id: "6",
			name: "Health",
			description: "Medical expenses, pharmacy",
			ownership: { type: "public" },
		},
		{
			id: "7",
			name: "Shopping",
			description: "Clothing, general purchases",
			ownership: { type: "public" },
		},
		{
			id: "8",
			name: "Education",
			description: "Courses, books, learning",
			ownership: { type: "public" },
		},
		{
			id: "9",
			name: "Travel",
			description: "Flights, hotels, trips",
			ownership: { type: "public" },
		},
		{
			id: "10",
			name: "Other",
			description: "Miscellaneous expenses",
			ownership: { type: "public" },
		},
	];

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
