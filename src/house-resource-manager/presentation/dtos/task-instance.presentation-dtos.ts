import type { Task } from "../../domain/entities";

export type TGetAllTaskInstancesResponse = {
	date: string;
	task: Task;
}[];
