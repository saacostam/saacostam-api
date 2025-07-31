import type { Task } from "../../domain/entities";

export interface TaskRepository {
	create(task: Task): Promise<Task>;
	deleteById(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<Task[]>;
	getById(id: string): Promise<Task | undefined>;
	updateById(id: string, task: Task): Promise<Task>;
}
