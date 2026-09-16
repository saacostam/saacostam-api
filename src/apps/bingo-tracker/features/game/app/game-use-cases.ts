import type { Game } from "@/apps/bingo-tracker/features/game/domain";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { errorFactory } from "@/apps/bingo-tracker/shared/errors";

export class GameUseCases {
	constructor(private ctx: Context) {}

	async createGame(args: {
		name: string;
		userId: string;
	}): Promise<{ gameId: string }> {
		const { name, userId } = args;

		const game: Game = {
			id: this.ctx.adapter.idGen.gen(),
			name,
			userId,
			createdAt: this.ctx.adapter.date.now(),
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
		}));
	}
}
