import type { Task } from "@/apps/hrm/domain";

export interface TaskRepository {
	create(task: Task): Promise<Task>;
	deleteById(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<Task[]>;
	getById(id: string): Promise<Task | undefined>;
	updateById(id: string, task: Task): Promise<Task>;
}
