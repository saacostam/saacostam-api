import { CategoryRepository } from "../../app/repositories";
import { Category } from "../../domain/entities";

const CATEGORIES: Category[] = []

export class InMemoryCategoryRepositoryImpl implements CategoryRepository {
    create(category: Category): Promise<Category> {
        CATEGORIES.push(category);

        return new Promise<Category>((res) => res(category));
    }

    getAll(): Promise<Category[]> {
        return new Promise<Category[]>((res) => res(CATEGORIES));
    }
}
