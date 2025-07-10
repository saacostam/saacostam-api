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

	getAll(): Promise<Category[]> {
		return new Promise<Category[]>((res) => res(CATEGORIES));
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
