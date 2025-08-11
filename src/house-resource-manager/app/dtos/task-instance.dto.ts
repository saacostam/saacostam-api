import type { Task } from "../../domain/entities";
import type { CalendarDate } from "../../domain/value-objects";

export interface GetAllTaskInstancesDto {
	userId: string;
}

export type TaskInstanceStatus =
	| {
			type: "virtual";
	  }
	| {
			type: "committed";
			id: string;
	  };

export type GetAllTaskInstancesAppResponse = {
	status: TaskInstanceStatus;
	date: CalendarDate;
	task: Task;
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
