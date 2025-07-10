import type { CategoryRepository } from "../../app/repositories";
import type { Category } from "../../domain/entities";

let CATEGORIES: Category[] = [];

export class InMemoryCategoryRepositoryImpl implements CategoryRepository {
	create(category: Category): Promise<Category> {
		CATEGORIES.push(category);

		return new Promise<Category>((res) => res(category));
	}

	deleteById(id: string): Promise<void> {
		CATEGORIES = CATEGORIES.filter((cat) => cat.id !== id);

		return new Promise((res) => res());
	}

	getAllByUserId(userId: string): Promise<Category[]> {
		const categoriesOfUser = CATEGORIES.filter((cat) => cat.userId === userId);

		return new Promise<Category[]>((res) => res(categoriesOfUser));
	}

	getById(id: string): Promise<Category | undefined> {
		const category = CATEGORIES.find((cat) => cat.id === id);

		return new Promise<Category | undefined>((res) => res(category));
	}

	updateById(id: string, category: Category): Promise<Category> {
		CATEGORIES = CATEGORIES.map((cat) => (cat.id === id ? category : cat));

		return new Promise<Category>((res) => res(category));
	}
}
