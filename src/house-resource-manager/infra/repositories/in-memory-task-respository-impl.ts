import type { TaskRepository } from "../../app/repositories";
import type { Task } from "../../domain/entities";

let TASKS: Task[] = [];

export class InMemoryTaskRepositoryImpl implements TaskRepository {
	create(task: Task): Promise<Task> {
		TASKS.push(task);
		return new Promise((res) => res(task));
	}

	deleteById(id: string): Promise<void> {
		TASKS = TASKS.filter((t) => t.id !== id);

		return new Promise((res) => res());
	}

	getAllByUserId(userId: string): Promise<Task[]> {
		const tasksOfUser = TASKS.filter((t) => t.userId === userId);

		return new Promise((res) => res(tasksOfUser));
	}

	getById(id: string): Promise<Task | undefined> {
		const task = TASKS.find((t) => t.id === id);

		return new Promise((res) => res(task));
	}

	updateById(id: string, task: Task): Promise<Task> {
		TASKS = TASKS.map((t) => (t.id === id ? task : t));

		return new Promise((res) => res(task));
	}
}
