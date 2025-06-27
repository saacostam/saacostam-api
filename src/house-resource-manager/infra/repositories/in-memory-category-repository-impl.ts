import { Category } from "../../domain/entities";
import { CategoryRepository } from "../../domain/repositories";

const CATEGORIES: Category[] = []

export class CategoryRepositoryImplInMemory implements CategoryRepository {
    create(category: Category): Promise<Category> {
        CATEGORIES.push(category);

        return new Promise<Category>((res) => res(category));
    }

    getAll(): Promise<Category[]> {
        return new Promise<Category[]>((res) => res(CATEGORIES));
    }
}
