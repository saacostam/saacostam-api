import type { Task, TaskCompletion } from "@/apps/hrm/domain";

export interface TGetImmediateTaskInstancesResponse {
	taskInstances: {
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
	stats: {
		totalResources: number;
		pendingTasks: number;
		overdueTasks: number;
	};
}

export type TCreateTaskCompletionResponse = Pick<TaskCompletion, "id">;
