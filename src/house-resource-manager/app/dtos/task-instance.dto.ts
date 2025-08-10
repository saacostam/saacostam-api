import type { Task } from "../../domain/entities";
import type { CalendarDate } from "../../domain/value-objects";

export interface GetAllTaskInstancesDto {
	userId: string;
}

export type GetAllTaskInstancesAppResponse = {
	task: Task;
	date: CalendarDate;
}[];
