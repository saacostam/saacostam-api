import {
	type BoardTemplate,
	DEFAULT_BOARD_TEMPLATE,
} from "@/apps/bingo-tracker/features/board-template/domain";
import type { Game } from "@/apps/bingo-tracker/features/game/domain";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { errorFactory } from "@/apps/bingo-tracker/shared/errors";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class GameUseCases {
	constructor(private ctx: Context) {}

	async createGame({
		name,
		userId,
	}: GameUseCasesPayload["createGame"]["req"]): Promise<
		GameUseCasesPayload["createGame"]["res"]
	> {
		let boardTemplate: BoardTemplate;
		try {
			const createBoardTemplatePayload: BoardTemplate = {
				...DEFAULT_BOARD_TEMPLATE,
				id: this.ctx.adapter.idGen.gen(),
			};
			boardTemplate = await this.ctx.repo.boardTemplate.create(
				createBoardTemplatePayload,
			);
		} catch {
			throw new BaseDomainError({
				type: DomainErrorType.SERVER_ERROR,
				message: `[GameUseCases.createGame] Unable to create game's board template.`,
				userMessage: "Unable to create game",
			});
		}

		const game: Game = {
			id: this.ctx.adapter.idGen.gen(),
			name,
			userId,
			createdAt: this.ctx.adapter.date.now(),
			boardTemplateId: boardTemplate.id,
		};

		const createdGame = await this.ctx.repo.game.create(game);

		return {
			gameId: createdGame.id,
		};
	}

	async deleteGame({
		gameId,
		userId,
	}: GameUseCasesPayload["deleteGame"]["req"]): Promise<void> {
		const game = await this.getAuthorizedGame(
			gameId,
			userId,
			"GameUseCases.deleteGame",
		);

		return this.ctx.repo.game.delete(game.id);
	}

	async getGames({
		userId,
	}: GameUseCasesPayload["getGames"]["req"]): Promise<
		GameUseCasesPayload["getGames"]["res"]
	> {
		const games = await this.ctx.repo.game.getAllByUserId(userId);

		return games.map((g) => ({
			id: g.id,
			name: g.name,
			createdAt: g.createdAt,
			userId: g.userId,
			boardTemplateId: g.boardTemplateId,
		}));
	}

	async setBoardTemplate({
		boardTemplate,
		gameId,
		userId,
	}: GameUseCasesPayload["setBoardTemplate"]["req"]): Promise<void> {
		const existingGame = await this.getAuthorizedGame(
			gameId,
			userId,
			"GameUseCases.setBoardTemplate",
		);

		const existingBoardTemplate = await this.ctx.repo.boardTemplate.getById(
			existingGame.boardTemplateId,
		);
		if (existingBoardTemplate === null) {
			throw errorFactory.gameByIdNotFound({
				id: gameId,
				ctx: "GameUseCases.setBoardTemplate",
			});
		}

		const updateBoardTemplatePayload: BoardTemplate = {
			...existingBoardTemplate,
			...boardTemplate,
		};

		await this.ctx.repo.boardTemplate.update(
			existingBoardTemplate.id,
			updateBoardTemplatePayload,
		);
	}

	private async getAuthorizedGame(
		gameId: string,
		userId: string,
		ctx: string,
	): Promise<Game> {
		const game = await this.ctx.repo.game.getById(gameId);

		if (!game || game.userId !== userId) {
			throw errorFactory.gameByIdNotFound({
				id: gameId,
				ctx,
			});
		}

		return game;
	}
}

export interface GameUseCasesPayload {
	createGame: {
		req: {
			name: string;
			userId: string;
		};
		res: { gameId: string };
	};
	deleteGame: {
		req: { gameId: string; userId: string };
	};
	getGames: {
		req: { userId: string };
		res: Game[];
	};
	setBoardTemplate: {
		req: {
			boardTemplate: Pick<BoardTemplate, "grid" | "boardRange">;
			gameId: string;
			userId: string;
		};
	};
}
