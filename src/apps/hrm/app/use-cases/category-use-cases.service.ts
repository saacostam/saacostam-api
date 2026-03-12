import { Category } from "@/apps/hrm/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { generateId } from "@/shared/utils";
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

	createCategory({
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

		const notFoundError = new BaseDomainError({
			type: DomainErrorType.NOT_FOUND,
			userMessage: "Category not found",
			message: `[CategoryUseCasesService._getExistingById] Category with id ${id} and user id ${userId} not found`,
		});

		if (!existingCategory) throw notFoundError;
		if (existingCategory.userId !== userId) throw notFoundError;

		return existingCategory;
	}
}
