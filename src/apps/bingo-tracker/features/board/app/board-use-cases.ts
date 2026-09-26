import type { Board } from "@/apps/bingo-tracker/features/board/domain";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { errorFactory } from "@/apps/bingo-tracker/shared/errors";
import type { ImageInput } from "@/apps/bingo-tracker/shared/types";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

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

	async readFromFile({
		boardTemplateId,
		image,
		userId,
	}: BoardUseCasesPayload["readFromFile"]["req"]): Promise<
		BoardUseCasesPayload["readFromFile"]["res"]
	> {
		const isAllowed =
			await this.ctx.repo.allowList.isAllowedToUseVision(userId);

		if (!isAllowed) {
			throw errorFactory.notAllowed({
				action: "use the vision provider",
				ctx: "BoardUseCases.readFromFile",
			});
		}

		const boardTemplate =
			await this.ctx.repo.boardTemplate.getById(boardTemplateId);

		if (!boardTemplate) {
			throw errorFactory.boardTemplateByIdNotFound({
				id: boardTemplateId,
				ctx: "BoardUseCases.readFromFile",
				append: "Board template not found",
			});
		}

		const game = await this.ctx.repo.game.getByBoardTemplateId(
			boardTemplate.id,
		);

		if (!game || game.userId !== userId) {
			throw errorFactory.boardTemplateByIdNotFound({
				id: boardTemplateId,
				ctx: "BoardUseCases.readFromFile",
				append: "User game not found",
			});
		}

		this.validateImage(image);

		const { board: values } = await this.ctx.adapter.vision.extractBoard({
			image,
			description: "",
		});

		return { values };
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
				append: "Board not found",
			});
		}

		return board;
	}

	private validateImage(image: ImageInput): void {
		const supportedTypes = ["image/png", "image/jpeg"];

		if (!supportedTypes.includes(image.mimeType)) {
			throw new BaseDomainError({
				type: DomainErrorType.BAD_REQUEST,
				userMessage: "Unsupported image type",
				message: `[BoardUseCases.readFromFile] Unsupported image type: ${image.mimeType}`,
			});
		}
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
	readFromFile: {
		req: {
			boardTemplateId: string;
			image: ImageInput;
			userId: string;
		};
		res: {
			values: Board["values"];
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
