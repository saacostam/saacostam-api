import type {
	Board,
	BoardRepository,
} from "@/apps/bingo-tracker/features/board/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class MemoryBoardRepository implements BoardRepository {
	private boards: Board[] = [];

	async create(board: Board): Promise<Board> {
		this.boards.push(board);

		return board;
	}

	async delete(id: string): Promise<void> {
		this.boards = this.boards.filter((b) => b.id !== id);
	}

	async getAllByIdList(idList: string[]): Promise<Board[]> {
		return this.boards.filter((b) => {
			idList.includes(b.id);
		});
	}

	async getAllByGameId(gameId: string): Promise<Board[]> {
		return this.boards.filter((b) => b.gameId === gameId);
	}

	async getById(id: string): Promise<Board | null> {
		const board = this.boards.find((b) => b.id === id);

		return board ?? null;
	}

	async updateById(id: string, board: Board): Promise<Board> {
		const exists = this.boards.find((b) => b.id === id);

		if (!exists) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				message: `[MemoryBoardRepository.updateById] Board with id ${id} was not found`,
				userMessage: "Trying to update a board which doesn't exist",
			});
		}

		this.boards = this.boards.map((b) => (b.id === id ? board : b));

		return board;
	}
}
