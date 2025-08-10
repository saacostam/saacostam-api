import type { TaskInstance } from "../../domain/entities";

export type TGetAllTaskInstancesResponse = (Omit<TaskInstance, "date"> & {
	date: string;
})[];
