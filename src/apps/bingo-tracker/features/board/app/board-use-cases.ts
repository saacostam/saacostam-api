import type { Board } from "@/apps/bingo-tracker/features/board/domain";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { errorFactory } from "@/apps/bingo-tracker/shared/errors";

export class BoardUseCases {
	constructor(private ctx: Context) {}

	async create({
		gameId,
		name,
		userId,
		values,
	}: BoardUseCasesPayload["create"]["req"]): Promise<
		BoardUseCasesPayload["create"]["res"]
	> {
		const game = await this.ctx.repo.game.getById(gameId);

		if (game === null || game.userId !== userId) {
			throw errorFactory.gameByIdNotFound({
				id: gameId,
				ctx: "BoardUseCases.create",
			});
		}

		const createBoardPayload: Board = {
			id: this.ctx.adapter.idGen.gen(),
			name,
			values,
			gameId,
		};

		const createdBoard = await this.ctx.repo.board.create(createBoardPayload);

		return {
			id: createdBoard.id,
		};
	}

	async delete({
		boardId,
		userId,
	}: BoardUseCasesPayload["delete"]["req"]): Promise<void> {
		const board = await this.getAuthorizedBoard(
			boardId,
			userId,
			"BoardUseCases.delete",
		);

		await this.ctx.repo.board.delete(board.id);
	}

	async getById({
		boardId,
		userId,
	}: BoardUseCasesPayload["getById"]["req"]): Promise<
		BoardUseCasesPayload["getById"]["res"]
	> {
		const board = await this.getAuthorizedBoard(
			boardId,
			userId,
			"BoardUseCases.getById",
		);

		return {
			board,
		};
	}

	async update({
		board,
		boardId,
		userId,
	}: BoardUseCasesPayload["update"]["req"]): Promise<void> {
		const existingBoard = await this.getAuthorizedBoard(
			boardId,
			userId,
			"BoardUseCases.update",
		);

		const updateBoardPayload: Board = {
			...existingBoard,
			...board,
		};

		await this.ctx.repo.board.updateById(existingBoard.id, updateBoardPayload);
	}

	private async getAuthorizedBoard(
		boardId: string,
		userId: string,
		ctx: string,
	): Promise<Board> {
		const board = await this.ctx.repo.board.getById(boardId);

		if (!board) {
			throw errorFactory.boardByIdNotFound({
				id: boardId,
				ctx,
				append: "Board not found",
			});
		}

		const game = await this.ctx.repo.game.getById(board.gameId);

		if (!game || game.userId !== userId) {
			throw errorFactory.boardByIdNotFound({
				id: boardId,
				ctx,
				append: "Game not found",
			});
		}

		return board;
	}
}

export interface BoardUseCasesPayload {
	create: {
		req: {
			gameId: string;
			name: string;
			userId: string;
			values: Board["values"];
		};
		res: {
			id: string;
		};
	};
	delete: {
		req: {
			boardId: string;
			userId: string;
		};
	};
	getById: {
		req: {
			boardId: string;
			userId: string;
		};
		res: {
			board: Board;
		};
	};
	update: {
		req: {
			board: Omit<Board, "id" | "gameId">;
			boardId: string;
			userId: string;
		};
	};
}
