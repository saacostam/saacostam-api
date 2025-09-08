import type { TaskRepository } from "../../app/repositories";
import { Task } from "../../domain/entities";
import { CalendarDate } from "../../domain/value-objects";

let TASKS: Task[] = [
	new Task(
		"9227a66c-34ca-4339-a224-c2b1d71c3c22",
		"Daily Task",
		"Daily Task for debugging",
		null,
		null,
		{
			type: "daily",
		},
		"9227a66c-34ca-4339-a224-c2b1d71c3c26",
		CalendarDate.anchorDates("America/Bogota").today,
	),
];

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
