import type { Cadence } from "../../domain/entities";

export interface CreateTaskRequestDto {
	name: string;
	description: string | null;
	resourcesIds: string[] | null;
	categoryId: string | null;
	cadence: Cadence;
	userId: string;
	anchorDate: string;
}

export interface DeleteTaskRequestDto {
	id: string;
	userId: string;
}

export interface UpdateTaskRequestDto {
	id: string;
	name?: string;
	description?: string | null;
	resourcesIds?: string[] | null;
	categoryId?: string | null;
	cadence?: Cadence;
	userId?: string;
	anchorDate?: string;
}

export interface GetAllTasksRequestDto {
	userId: string;
}

export interface GetTaskByIdRequestDto {
	id: string;
	userId: string;
}
