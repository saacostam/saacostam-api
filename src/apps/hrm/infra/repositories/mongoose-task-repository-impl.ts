import type { InferSchemaType } from "mongoose";
import type { TaskRepository } from "@/apps/hrm/app";
import { type Cadence, Task } from "@/apps/hrm/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { TaskModel, type TaskSchema } from "../mongoose";

export class MongooseTaskRepositoryImpl implements TaskRepository {
	async create(task: Task): Promise<Task> {
		const newTask = await TaskModel.create({ ...task, _id: task.id });
		return this._mapDocumentEntryToDomainObject(newTask);
	}

	async deleteById(id: string): Promise<void> {
		await TaskModel.deleteOne({ _id: id });
	}

	async getAllByUserId(userId: string): Promise<Task[]> {
		const tasks = await TaskModel.find({ userId });
		return tasks.map(this._mapDocumentEntryToDomainObject);
	}

	async getById(id: string): Promise<Task | undefined> {
		const task = await TaskModel.findById(id);
		return task ? this._mapDocumentEntryToDomainObject(task) : undefined;
	}

	async updateById(id: string, task: Task): Promise<Task> {
		const updatedTask = await TaskModel.findByIdAndUpdate(id, {
			...task,
			_id: task.id,
		});

		if (!updatedTask) {
			throw new BaseDomainError({
				type: DomainErrorType.SERVER_ERROR,
				message:
					"[MongooseTaskRepositoryImpl.updateById] - Unable to update task: no task found with the provided id",
				userMessage: "Task not found",
			});
		}

		return this._mapDocumentEntryToDomainObject(updatedTask);
	}

	_mapDocumentEntryToDomainObject(
		documentEntry: InferSchemaType<typeof TaskSchema>,
	): Task {
		return new Task(
			documentEntry._id,
			documentEntry.name,
			documentEntry.description,
			documentEntry.resourcesIds,
			documentEntry.categoryId,
			documentEntry.cadence as Cadence,
			documentEntry.userId,
			documentEntry.anchorDate,
		);
	}
}
