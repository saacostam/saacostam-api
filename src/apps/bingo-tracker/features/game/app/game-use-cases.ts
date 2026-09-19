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

	async createGame(args: {
		name: string;
		userId: string;
	}): Promise<{ gameId: string }> {
		const { name, userId } = args;

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

	async deleteGame(args: { gameId: string; userId: string }): Promise<void> {
		const { gameId, userId } = args;

		const game = await this.ctx.repo.game.getById(gameId);

		if (!game || game.userId !== userId) {
			throw errorFactory.gameByIdNotFound({
				id: gameId,
				ctx: "GameUseCases.deleteGame",
			});
		}

		return this.ctx.repo.game.delete(game.id);
	}

	async getGames(args: { userId: string }): Promise<Game[]> {
		const { userId } = args;

		const games = await this.ctx.repo.game.getAllByUserId(userId);

		return games.map((g) => ({
			id: g.id,
			name: g.name,
			createdAt: g.createdAt,
			userId: g.userId,
			boardTemplateId: g.boardTemplateId,
		}));
	}
}
