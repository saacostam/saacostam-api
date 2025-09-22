import type { TaskRepository } from "../../app/repositories";
import { Task } from "../../domain/entities";

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
		"2025-08-02",
	),
	new Task(
		"12b3955d-29a0-41bb-807a-e185ef5c1c18",
		"Third Thursday",
		"Third Thursday",
		null,
		null,
		{
			type: "monthly-by-weekday",
			weekOfTheMonth: 3,
			dayOfTheWeek: 3,
		},
		"9227a66c-34ca-4339-a224-c2b1d71c3c26",
		"2025-08-02",
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
