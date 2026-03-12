import type { Board } from "@/apps/hrm/domain";

export interface CreateBoardRequestDto {
	name: string;
	userId: string;
}

export interface DeleteBoardRequestDto {
	id: string;
	userId: string;
}

// Get All Boards

export interface GetAllBoardsRequestDto {
	userId: string;
}

export interface GetAllBoardsResponseDto {
	boards: GetAllBoardsResponseDtoItem[];
}

export class GetAllBoardsResponseDtoItem {
	constructor(
		public id: Board["id"],
		public name: Board["name"],
		public userId: Board["userId"],
	) {}
}

// End of - Get All Boards

export interface GetBoardByIdRequestDto {
	id: string;
	userId: string;
}

export interface UpdateBoardRequestDto {
	id: string;
	userId: string;

	name?: string;
	content?: string;
}
