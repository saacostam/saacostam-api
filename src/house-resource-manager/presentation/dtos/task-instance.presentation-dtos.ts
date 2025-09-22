import type { Task, TaskCompletion } from "../../domain/entities";

export type TGetImmediateTaskInstancesResponse = {
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
