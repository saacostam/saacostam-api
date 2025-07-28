import { generateId } from "../../../core.utils";

import { type Category, Resource } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import type {
	CreateResourceRequestDto,
	DeleteResourceRequestDto,
	GetAllResourcesRequestDto,
	GetResourceByIdRequestDto,
	UpdateResourceRequestDto,
} from "../dtos";
import type { CategoryRepository, ResourceRepository } from "../repositories";

export class ResourceUseCasesService {
	constructor(
		private resourceRepository: ResourceRepository,
		private categoryRepository: CategoryRepository,
	) {}

	async createResource({
		name,
		description,
		quantity,
		categoryId,
		userId,
	}: CreateResourceRequestDto): Promise<Resource> {
		const category = await this._getCategoryById(
			categoryId,
			userId,
			"categoryId",
		);

		const resource = new Resource(
			generateId(),
			name,
			description ?? null,
			"active",
			new Date(),
			new Date(),
			category.id,
			quantity,
			userId,
		);

		return this.resourceRepository.create(resource);
	}

	async deleteResource({
		id,
		userId,
	}: DeleteResourceRequestDto): Promise<void> {
		const existingResource = await this._getExistingById(id, userId);
		return this.resourceRepository.deleteById(existingResource.id);
	}

	getResources({ userId }: GetAllResourcesRequestDto) {
		return this.resourceRepository.getAllByUserId(userId);
	}

	getResourceById({ id, userId }: GetResourceByIdRequestDto) {
		return this._getExistingById(id, userId);
	}

	async updateResource({
		id,
		name,
		description,
		quantity,
		categoryId,
		userId,
	}: UpdateResourceRequestDto) {
		const existingResource = await this._getExistingById(id, userId);

		// If new category is included in payload, we should validate existence and ownership.
		if (categoryId !== undefined) {
			const category = await this._getCategoryById(
				categoryId,
				userId,
				"categoryId",
			);
			categoryId = category.id;
		}

		const updatedResource = new Resource(
			existingResource.id,
			name === undefined ? existingResource.name : name,
			description === undefined ? existingResource.description : description,
			existingResource.status,
			existingResource.creationDate,
			new Date(),
			categoryId === undefined ? existingResource.categoryId : categoryId,
			quantity === undefined ? existingResource.quantity : quantity,
			userId,
		);

		return this.resourceRepository.updateById(id, updatedResource);
	}

	async _getExistingById(id: string, userId: string): Promise<Resource> {
		const notFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Resource with id ${id} not found`,
		);

		const existingResource = await this.resourceRepository.getById(id);

		if (!existingResource) throw notFoundError;
		if (existingResource.userId !== userId) throw notFoundError;

		return existingResource;
	}

	async _getCategoryById(
		categoryId: string,
		userId: string,
		fieldName: string,
	): Promise<Category> {
		const categoryNotFound = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Category with id ${categoryId} not found`,
			[
				{
					field: fieldName,
					message: `Category not found`,
				},
			],
		);

		const category = await this.categoryRepository.getById(categoryId);

		if (!category) throw categoryNotFound;
		if (category.userId !== userId) throw categoryNotFound;

		return category;
	}
}
