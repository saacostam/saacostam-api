import type { Category, Resource, Task } from "@/apps/hrm/domain";

export type TGetTaskByIdResponse = Omit<Task, "anchorDate"> & {
	category: Category | null;
	resources: Resource[] | null;
	anchorDate: string;
};

export type TGetAllTasksResponse = TGetTaskByIdResponse[];

export type TCreateTaskResponse = Pick<Task, "id">;
export type TUpdateTaskResponse = Pick<Task, "id">;
