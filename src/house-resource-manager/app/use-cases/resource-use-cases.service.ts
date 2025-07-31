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
	}: CreateResourceRequestDto) {
		let category: Category | null = null;

		if (categoryId) {
			category = await this._getCategoryById(categoryId, userId, "categoryId");
		}

		const resource = new Resource(
			generateId(),
			name,
			description ?? null,
			"active",
			new Date(),
			new Date(),
			category ? category.id : null,
			quantity,
			userId,
		);

		const newResource = await this.resourceRepository.create(resource);

		return {
			id: newResource.id,
		};
	}

	async deleteResource({
		id,
		userId,
	}: DeleteResourceRequestDto): Promise<void> {
		const existingResource = await this._getExistingById(id, userId);
		return this.resourceRepository.deleteById(existingResource.id);
	}

	async getResources({ userId }: GetAllResourcesRequestDto) {
		const [resources, categories] = await Promise.all([
			this.resourceRepository.getAllByUserId(userId),
			this.categoryRepository.getAllByUserId(userId),
		]);

		return resources.map((r) => {
			const linkedCategory = categories.find((c) => c.id === r.categoryId);

			return {
				...r,
				category: linkedCategory ?? null,
			};
		});
	}

	async getResourceById({ id, userId }: GetResourceByIdRequestDto) {
		const resource = await this._getExistingById(id, userId);

		let category: Category | null = null;
		if (resource.categoryId) {
			const queriedCategory = await this.categoryRepository.getById(
				resource.categoryId,
			);
			category = queriedCategory ?? null;
		}

		return {
			...resource,
			category,
		};
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
		if (categoryId !== undefined && categoryId !== null) {
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

		const newResourceEntry = await this.resourceRepository.updateById(
			id,
			updatedResource,
		);

		return {
			id: newResourceEntry.id,
		};
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
