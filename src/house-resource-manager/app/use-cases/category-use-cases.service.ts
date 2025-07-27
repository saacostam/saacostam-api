import { generateId } from "../../../core.utils";

import { Category } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";

import type {
	CreateCategoryRequestDto,
	DeleteCategoryRequestDto,
	GetAllCategoriesRequestDto,
	GetCategoryByIdRequestDto,
	UpdateCategoryRequestDto,
} from "../dtos";
import type { CategoryRepository } from "../repositories";

export class CategoryUseCasesService {
	constructor(private categoryRepository: CategoryRepository) {}

	createResource({
		name,
		description,
		userId,
	}: CreateCategoryRequestDto): Promise<Category> {
		const category = new Category(
			generateId(),
			name,
			description ?? null,
			userId,
		);

		return this.categoryRepository.create(category);
	}

	async deleteCategory({
		id,
		userId,
	}: DeleteCategoryRequestDto): Promise<void> {
		const existingCategory = await this._getExistingById(id, userId);
		return this.categoryRepository.deleteById(existingCategory.id);
	}

	getCategories({ userId }: GetAllCategoriesRequestDto) {
		return this.categoryRepository.getAllByUserId(userId);
	}

	getCategoryById({ id, userId }: GetCategoryByIdRequestDto) {
		return this._getExistingById(id, userId);
	}

	async updateCategory({
		id,
		name,
		description,
		userId,
	}: UpdateCategoryRequestDto): Promise<Category> {
		const existingCategory = await this._getExistingById(id, userId);

		const newName = name === undefined ? existingCategory.name : name;
		const newDescription =
			description === undefined ? existingCategory.description : description;

		const updatedCategory = new Category(id, newName, newDescription, userId);

		return this.categoryRepository.updateById(id, updatedCategory);
	}

	async _getExistingById(id: string, userId: string): Promise<Category> {
		const existingCategory = await this.categoryRepository.getById(id);

		const notFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Resource with id ${id} not found`,
		);

		if (!existingCategory) throw notFoundError;
		if (existingCategory.userId !== userId) throw notFoundError;

		return existingCategory;
	}
}
