import type { InferSchemaType } from "mongoose";
import type { CategoryRepository } from "@/apps/hrm/app";
import { BaseDomainError, Category, DomainErrorType } from "@/apps/hrm/domain";
import { CategoryModel, type CategorySchema } from "../mongoose";

export class MongooseCategoryRepositoryImpl implements CategoryRepository {
	async create(category: Category): Promise<Category> {
		const newCategory = await CategoryModel.create({
			...category,
			_id: category.id,
		});
		return this._mapDocumentEntryToDomainObject(newCategory);
	}

	async deleteById(id: string): Promise<void> {
		await CategoryModel.deleteOne({ _id: id });
	}

	async getAllByUserId(userId: string): Promise<Category[]> {
		const categories = await CategoryModel.find({ userId });
		return categories.map(this._mapDocumentEntryToDomainObject);
	}

	async getById(id: string): Promise<Category | undefined> {
		const category = await CategoryModel.findById(id);
		return category
			? this._mapDocumentEntryToDomainObject(category)
			: undefined;
	}

	async updateById(id: string, category: Category): Promise<Category> {
		const updatedCategory = await CategoryModel.findByIdAndUpdate(id, {
			...category,
			_id: category.id,
		});

		if (!updatedCategory) {
			throw new BaseDomainError(
				DomainErrorType.SERVER_ERROR,
				"[MongooseCategoryRepositoryImpl.updateById] - Unable to update category: no category found with the provided id",
			);
		}

		return this._mapDocumentEntryToDomainObject(updatedCategory);
	}

	_mapDocumentEntryToDomainObject(
		documentEntry: InferSchemaType<typeof CategorySchema>,
	): Category {
		return new Category(
			documentEntry._id,
			documentEntry.name,
			documentEntry.description,
			documentEntry.userId,
		);
	}
}
