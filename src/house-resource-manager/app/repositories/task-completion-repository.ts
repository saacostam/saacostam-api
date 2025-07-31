import type { TaskCompletion } from "../../domain/entities";

export interface TaskCompletionRepository {
	create(taskCompletion: TaskCompletion): Promise<TaskCompletion>;
	deleteById(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<TaskCompletion[]>;
	getById(id: string): Promise<TaskCompletion | undefined>;
	updateById(
		id: string,
		taskCompletion: TaskCompletion,
	): Promise<TaskCompletion>;
}
