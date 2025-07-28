import { generateId } from "../../../core.utils";

import { Resource } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import type {
	CreateResourceRequestDto,
	DeleteResourceRequestDto,
	GetAllResourcesRequestDto,
	GetResourceByIdRequestDto,
	UpdateResourceRequestDto,
} from "../dtos";
import type { ResourceRepository } from "../repositories";

export class ResourceUseCasesService {
	constructor(private resourceRepository: ResourceRepository) {}

	createResource({
		name,
		description,
		quantity,
		categoryId,
		userId,
	}: CreateResourceRequestDto): Promise<Resource> {
		const resource = new Resource(
			generateId(),
			name,
			description ?? null,
			"active",
			new Date(),
			new Date(),
			categoryId,
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
		const existingResource = await this.resourceRepository.getById(id);

		const notFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Resource with id ${id} not found`,
		);

		if (!existingResource) throw notFoundError;
		if (existingResource.userId !== userId) throw notFoundError;

		return existingResource;
	}
}
