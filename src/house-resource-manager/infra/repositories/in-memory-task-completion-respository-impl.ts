import type { TaskCompletionRepository } from "../../app/repositories";
import type { TaskCompletion } from "../../domain/entities";

let TASK_COMPLETIONS: TaskCompletion[] = [];

export class InMemoryTaskCompletionRepositoryImpl
	implements TaskCompletionRepository
{
	create(taskCompletion: TaskCompletion): Promise<TaskCompletion> {
		TASK_COMPLETIONS.push(taskCompletion);
		return new Promise((res) => res(taskCompletion));
	}

	deleteById(id: string): Promise<void> {
		TASK_COMPLETIONS = TASK_COMPLETIONS.filter((t) => t.id !== id);

		return new Promise((res) => res());
	}

	getAllByUserId(userId: string): Promise<TaskCompletion[]> {
		const taskCompletionsOfUser = TASK_COMPLETIONS.filter(
			(t) => t.userId === userId,
		);

		return new Promise((res) => res(taskCompletionsOfUser));
	}

	getById(id: string): Promise<TaskCompletion | undefined> {
		const taskCompletion = TASK_COMPLETIONS.find((t) => t.id === id);

		return new Promise((res) => res(taskCompletion));
	}

	updateById(
		id: string,
		taskCompletion: TaskCompletion,
	): Promise<TaskCompletion> {
		TASK_COMPLETIONS = TASK_COMPLETIONS.map((t) =>
			t.id === id ? taskCompletion : t,
		);

		return new Promise((res) => res(taskCompletion));
	}
}
