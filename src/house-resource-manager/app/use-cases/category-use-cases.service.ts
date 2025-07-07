import { generateId } from "../../../core.utils";

import { Category } from "../../domain/entities";

import { CreateCategoryRequestDto } from "../dtos";
import { CategoryRepository } from "../repositories";

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
