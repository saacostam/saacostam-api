import { generateId } from "./../../../core.utils";

import { Category } from "../../domain/entities";
import { CategoryRepository } from "../../domain/repositories";

import { CreateCategoryRequestDto } from "../dtos";

export class CategoryUseCasesService {
    constructor(
        private categoryRepository: CategoryRepository,
    ) {}

    createResource({
        name,
        description,
    }: CreateCategoryRequestDto): Promise<Category> {
        const category = new Category(
            generateId(),
            name,
            description,
        )

        return this.categoryRepository.create(category)
    }

    getResources() {
        return this.categoryRepository.getAll();
    }
}
