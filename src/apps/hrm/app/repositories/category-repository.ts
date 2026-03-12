import type { Category } from "@/apps/hrm/domain";

export interface CategoryRepository {
	create(category: Category): Promise<Category>;
	deleteById(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<Category[]>;
	getById(id: string): Promise<Category | undefined>;
	updateById(id: string, category: Category): Promise<Category>;
}
