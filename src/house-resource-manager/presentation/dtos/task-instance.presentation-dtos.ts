import type { Task, TaskCompletion } from "../../domain/entities";

export type TGetAllTaskInstancesResponse = {
	date: string;
	task: Task;
	status:
		| {
				type: "virtual";
		  }
		| {
				type: "committed";
				id: string;
		  };
}[];

export type TCreateTaskCompletionResponse = Pick<TaskCompletion, "id">;
