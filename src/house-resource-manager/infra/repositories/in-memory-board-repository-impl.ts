import type { BoardRepository } from "../../app/repositories";
import type { Board } from "../../domain/entities";

let BOARD: Board[] = [];

export class InMemoryBoardRepositoryImpl implements BoardRepository {
	async create(board: Board): Promise<Board> {
		BOARD = [...BOARD, board];

		return board;
	}

	async deleteById(id: string): Promise<void> {
		BOARD = BOARD.filter((b) => b.id !== id);
	}

	async getAllByUserId(userId: string): Promise<Board[]> {
		return BOARD.filter((b) => b.userId === userId);
	}

	async getById(id: string): Promise<Board | undefined> {
		return BOARD.find((b) => b.id === id);
	}

	async updateById(id: string, board: Board): Promise<Board> {
		BOARD = BOARD.map((currBoard) => (currBoard.id === id ? board : currBoard));
		return board;
	}
}
