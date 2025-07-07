import { Category } from "../../domain/entities";

export interface CategoryRepository {
    create(category: Category): Promise<Category>;
    getAll(): Promise<Category[]>;
    getById(id: string): Promise<Category | undefined>;
    updateById(id: string, category: Category): Promise<Category>;
}
