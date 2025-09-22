import type { Task } from "../../domain/entities";

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
	date: string;
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
