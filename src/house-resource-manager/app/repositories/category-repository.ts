import { Category } from "../../domain/entities";

export interface CategoryRepository {
    create(category: Category): Promise<Category>;
    getAll(): Promise<Category[]>
}
