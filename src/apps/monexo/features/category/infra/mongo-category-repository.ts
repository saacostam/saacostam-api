import type { Collection } from "mongodb";

import type {
	ICategory,
	ICategoryRepository,
} from "@/apps/monexo/features/category/domain";
import { monexoDb } from "@/apps/monexo/shared/mongo";

interface CategoryDocument {
	_id: string;
	name: string;
	description: string;
	ownership:
		| {
				type: "public";
		  }
		| {
				type: "private";
				userId: string;
		  };
}

const categoriesCollection: Collection<CategoryDocument> =
	monexoDb.collection("categories");

export class MongoCategoryRepository implements ICategoryRepository {
	async create(category: ICategory): Promise<ICategory> {
		await categoriesCollection.insertOne({
			_id: category.id,
			name: category.name,
			description: category.description,
			ownership: category.ownership,
		});

		return category;
	}

	async delete(id: string): Promise<void> {
		await categoriesCollection.deleteOne({
			_id: id,
		});
	}

	async getAllPublic(): Promise<ICategory[]> {
		return publicCategories;
	}

	async getAllPrivate(userId: string): Promise<ICategory[]> {
		const categories = await categoriesCollection
			.find({
				"ownership.type": "private",
				"ownership.userId": userId,
			})
			.toArray();

		return categories.map(this.mapToDomain);
	}

	async getAllByIdList(ids: string[]): Promise<ICategory[]> {
		const privateCategories = await categoriesCollection
			.find({
				_id: {
					$in: ids,
				},
			})
			.toArray();

		const publicMatches = publicCategories.filter((c) => ids.includes(c.id));

		return [...publicMatches, ...privateCategories.map(this.mapToDomain)];
	}

	async getById(id: string): Promise<ICategory | null> {
		const publicCategory = publicCategories.find((c) => c.id === id);

		if (publicCategory !== undefined) {
			return publicCategory;
		}

		const category = await categoriesCollection.findOne({
			_id: id,
		});

		if (category === null) return null;

		return this.mapToDomain(category);
	}

	async updateCategory(id: string, category: ICategory): Promise<ICategory> {
		await categoriesCollection.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					name: category.name,
					description: category.description,
					ownership: category.ownership,
				},
			},
		);

		return category;
	}

	private mapToDomain(category: CategoryDocument): ICategory {
		return {
			id: category._id,
			name: category.name,
			description: category.description,
			ownership: category.ownership,
		};
	}
}

const publicCategories: ICategory[] = [
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
