import type { ScratchBoardRepository } from "../../app/repositories";
import type { ScratchBoard } from "../../domain/entities";

let SCRATCH_BOARDS: ScratchBoard[] = [];

export class InMemoryScratchBoardRepositoryImpl
	implements ScratchBoardRepository
{
	async create(board: ScratchBoard): Promise<ScratchBoard> {
		SCRATCH_BOARDS = [...SCRATCH_BOARDS, board];

		return board;
	}

	async deleteById(id: string): Promise<void> {
		SCRATCH_BOARDS = SCRATCH_BOARDS.filter((sb) => sb.id !== id);
	}

	async getAllByUserId(userId: string): Promise<ScratchBoard[]> {
		return SCRATCH_BOARDS.filter((sb) => sb.userId === userId);
	}

	async getById(id: string): Promise<ScratchBoard | undefined> {
		return SCRATCH_BOARDS.find((sb) => sb.id === id);
	}

	async updateById(id: string, board: ScratchBoard): Promise<ScratchBoard> {
		SCRATCH_BOARDS = SCRATCH_BOARDS.map((currScratchBoard) =>
			currScratchBoard.id === id ? board : currScratchBoard,
		);
		return board;
	}
}
