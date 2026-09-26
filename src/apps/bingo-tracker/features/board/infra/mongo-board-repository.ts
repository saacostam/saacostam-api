import type { Collection } from "mongodb";
import type {
	Board,
	BoardRepository,
} from "@/apps/bingo-tracker/features/board/domain";
import { bingoTrackingDb } from "@/apps/bingo-tracker/shared/mongo";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

interface BoardDocument {
	_id: string;
	name: string;
	values: (number | undefined)[][];
	gameId: string;
}

const boardsCollection: Collection<BoardDocument> =
	bingoTrackingDb.collection("boards");

export class MongoBoardRepository implements BoardRepository {
	async create(board: Board): Promise<Board> {
		await boardsCollection.insertOne({
			_id: board.id,
			name: board.name,
			values: board.values,
			gameId: board.gameId,
		});

		return board;
	}

	async delete(id: string): Promise<void> {
		await boardsCollection.deleteOne({
			_id: id,
		});
	}

	async getAllByIdList(idList: string[]): Promise<Board[]> {
		const boards = await boardsCollection
			.find({
				_id: {
					$in: idList,
				},
			})
			.toArray();

		return boards.map(this.mapToDomain);
	}

	async getAllByGameId(gameId: string): Promise<Board[]> {
		const boards = await boardsCollection
			.find({
				gameId,
			})
			.toArray();

		return boards.map(this.mapToDomain);
	}

	async getById(id: string): Promise<Board | null> {
		const board = await boardsCollection.findOne({
			_id: id,
		});

		if (board === null) {
			return null;
		}

		return this.mapToDomain(board);
	}

	async updateById(id: string, board: Board): Promise<Board> {
		const result = await boardsCollection.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					name: board.name,
					values: board.values,
					gameId: board.gameId,
				},
			},
		);

		if (result.matchedCount === 0) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				message: `[MongoBoardRepository.updateById] Board with id ${id} was not found`,
				userMessage: "Trying to update a board which doesn't exist",
			});
		}

		return board;
	}

	private mapToDomain(board: BoardDocument): Board {
		return {
			id: board._id,
			name: board.name,
			values: board.values,
			gameId: board.gameId,
		};
	}
}
