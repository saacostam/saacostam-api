import type { Task } from "../../domain/entities";
import type { CalendarDate } from "../../domain/value-objects";

export interface GetAllTaskInstancesDto {
	userId: string;
}

export type GetAllTaskInstancesAppResponse = {
	task: Task;
	date: CalendarDate;
}[];

export interface CreateTaskInstanceCompletionDto {
	date: string;
	taskId: string;
	userId: string;
}

export interface DeleteTaskInstanceCompletionDto {
	id: string;
	userId: string;
}
