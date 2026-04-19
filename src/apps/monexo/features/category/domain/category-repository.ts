import type { ICategory } from "./category-entity";

/**
 * Data access abstraction over the category entity.
 */
export interface ICategoryRepository {
	create(category: ICategory): Promise<ICategory>;
	delete(id: string): Promise<void>;
	getAllPublic(): Promise<ICategory[]>;
	getAllPrivate(userId: string): Promise<ICategory[]>;
	getById(id: string): Promise<ICategory | null>;
	updateCategory(id: string, category: ICategory): Promise<ICategory>;
}
