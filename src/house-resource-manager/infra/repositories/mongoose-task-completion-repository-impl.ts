import type { InferSchemaType } from "mongoose";
import type { TaskCompletionRepository } from "../../app/repositories";
import { TaskCompletion } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import { CalendarDate, type Timezone } from "../../domain/value-objects";
import { TaskCompletionModel, type TaskCompletionSchema } from "../mongoose";

export class MongooseTaskCompletionRepositoryImpl
	implements TaskCompletionRepository
{
	async create(taskCompletion: TaskCompletion): Promise<TaskCompletion> {
		const entry = await TaskCompletionModel.create({
			...taskCompletion,
			_id: taskCompletion.id,
		});
		return this._mapDocumentEntryToDomainObject(entry);
	}

	async deleteById(id: string): Promise<void> {
		await TaskCompletionModel.deleteOne({ _id: id });
	}

	async getAllByUserId(userId: string): Promise<TaskCompletion[]> {
		const taskCompletions = await TaskCompletionModel.find({ userId });
		return taskCompletions.map(this._mapDocumentEntryToDomainObject);
	}

	async getById(id: string): Promise<TaskCompletion | undefined> {
		const taskCompletion = await TaskCompletionModel.findById(id);

		return taskCompletion
			? this._mapDocumentEntryToDomainObject(taskCompletion)
			: undefined;
	}

	async updateById(
		id: string,
		taskCompletion: TaskCompletion,
	): Promise<TaskCompletion> {
		const updatedTaskCompletion = await TaskCompletionModel.findByIdAndUpdate(
			id,
			{ ...taskCompletion, _id: taskCompletion.id },
		);

		if (!updatedTaskCompletion) {
			throw new BaseDomainError(
				DomainErrorType.SERVER_ERROR,
				"[MongooseTaskCompletionRepositoryImpl.updateById] - Unable to update taskCompletion: no taskCompletion found with the provided id",
			);
		}

		return this._mapDocumentEntryToDomainObject(updatedTaskCompletion);
	}

	_mapDocumentEntryToDomainObject(
		documentEntry: InferSchemaType<typeof TaskCompletionSchema>,
	): TaskCompletion {
		return new TaskCompletion(
			documentEntry._id,
			documentEntry.taskId,
			CalendarDate.fromDate(
				documentEntry.date._date,
				documentEntry.date.timezone as Timezone,
			),
			documentEntry.userId,
		);
	}
}
