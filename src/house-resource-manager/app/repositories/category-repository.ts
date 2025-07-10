import type { Category } from "../../domain/entities";

export interface CategoryRepository {
	create(category: Category): Promise<Category>;
	deleteById(id: string): Promise<void>;
	getAll(): Promise<Category[]>;
	getById(id: string): Promise<Category | undefined>;
	updateById(id: string, category: Category): Promise<Category>;
}
