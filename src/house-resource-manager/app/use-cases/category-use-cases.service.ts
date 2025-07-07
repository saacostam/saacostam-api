import { generateId } from "../../../core.utils";

import { Category } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";

import { CreateCategoryRequestDto, UpdateCategoryRequestDto } from "../dtos";
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
            description ?? null,
        )

        return this.categoryRepository.create(category)
    }

    getResources() {
        return this.categoryRepository.getAll();
    }

    async updateResource({
        id,
        name,
        description,
    }: UpdateCategoryRequestDto): Promise<Category> {
        const existingCategory = await this.categoryRepository.getById(id);

        if (!existingCategory) throw new BaseDomainError(
            DomainErrorType.NOT_FOUND,
            `Resource with id ${id} not found`,
        )

        const newName = name === undefined ? existingCategory.name : name;
        const newDescription = description === undefined ? existingCategory.description : description;

        const updatedCategory = new Category(
            id,
            newName,
            newDescription,
        )

        return this.categoryRepository.updateById(id, updatedCategory);
    }
}
