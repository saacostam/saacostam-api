import type { ICategory } from "./category-entity";

/**
 * Data access abstraction over the category entity.
 */
export interface ICategoryRepository {
	create(category: ICategory): Promise<ICategory>;
	delete(id: string): Promise<void>;
	getAllPublic(): Promise<ICategory[]>;
	getAllPrivate(userId: string): Promise<ICategory[]>;
	/**
	 * Returns categories matching the provided list of IDs.
	 *
	 * Not all IDs are guaranteed to exist. Only categories that are found are returned;
	 * missing IDs are ignored and no error is thrown.
	 */
	getAllByIdList(ids: string[]): Promise<ICategory[]>;
	getById(id: string): Promise<ICategory | null>;
	updateCategory(id: string, category: ICategory): Promise<ICategory>;
}
