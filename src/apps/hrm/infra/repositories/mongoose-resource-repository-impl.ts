import type { InferSchemaType } from "mongoose";
import type { ResourceRepository } from "@/apps/hrm/app";
import { Resource } from "@/apps/hrm/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { ResourceModel, type ResourceSchema } from "../mongoose";

export class MongooseResourceRepositoryImpl implements ResourceRepository {
	async create(resource: Resource): Promise<Resource> {
		const newResource = await ResourceModel.create({
			...resource,
			_id: resource.id,
		});
		return this._mapDocumentEntryToDomainObject(newResource);
	}

	async deleteById(id: string): Promise<void> {
		await ResourceModel.deleteOne({ _id: id });
	}

	async getAllByUserId(userId: string): Promise<Resource[]> {
		const resources = await ResourceModel.find({ userId });
		return resources.map(this._mapDocumentEntryToDomainObject);
	}

	async countAllByUserid(userId: string): Promise<number> {
		return ResourceModel.countDocuments({ userId });
	}

	async getAllByIdList(ids: string[]): Promise<Resource[]> {
		const resources = await ResourceModel.find({ _id: { $in: ids } });
		return resources.map(this._mapDocumentEntryToDomainObject);
	}

	async getById(id: string): Promise<Resource | undefined> {
		const resource = await ResourceModel.findById(id);
		return resource
			? this._mapDocumentEntryToDomainObject(resource)
			: undefined;
	}

	async updateById(id: string, resource: Resource): Promise<Resource> {
		const updatedResource = await ResourceModel.findByIdAndUpdate(id, {
			...resource,
			_id: resource.id,
		});

		if (!updatedResource) {
			throw new BaseDomainError({
				type: DomainErrorType.SERVER_ERROR,
				message:
					"[MongooseResourceRepositoryImpl.updateById] - Unable to update resource: no resource found with the provided id",
				userMessage: "Something went wrong. Please try again",
			});
		}

		return this._mapDocumentEntryToDomainObject(updatedResource);
	}

	_mapDocumentEntryToDomainObject(
		documentEntry: InferSchemaType<typeof ResourceSchema>,
	): Resource {
		return new Resource(
			documentEntry._id,
			documentEntry.name,
			documentEntry.description,
			documentEntry.status,
			documentEntry.creationDate,
			documentEntry.updateDate,
			documentEntry.categoryId,
			documentEntry.quantity,
			documentEntry.userId,
		);
	}
}
