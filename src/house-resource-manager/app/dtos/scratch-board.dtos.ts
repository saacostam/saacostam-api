import type { ScratchBoard } from "../../domain/entities";

export interface CreateScratchBoardRequestDto {
	name: string;
	userId: string;
}

export interface DeleteScratchBoardRequestDto {
	id: string;
	userId: string;
}

// Get All Scratch Boards

export interface GetAllScratchBoardsRequestDto {
	userId: string;
}

export interface GetAllScratchBoardsResponseDto {
	scratchBoards: GetAllScratchBoardsResponseDtoItem[];
}

export class GetAllScratchBoardsResponseDtoItem {
	constructor(
		public id: ScratchBoard["id"],
		public name: ScratchBoard["name"],
		public userId: ScratchBoard["userId"],
	) {}
}

// End of - Get All Scratch Boards

export interface GetScratchBoardByIdRequestDto {
	id: string;
	userId: string;
}

export interface UpdateScratchBoardRequestDto {
	id: string;
	userId: string;

	name?: string;
	content?: string;
}
