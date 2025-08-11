import type { Task, TaskCompletion } from "../../domain/entities";

export type TGetAllTaskInstancesResponse = {
	date: string;
	task: Task;
}[];

export type TCreateTaskCompletionResponse = Pick<TaskCompletion, "id">;
