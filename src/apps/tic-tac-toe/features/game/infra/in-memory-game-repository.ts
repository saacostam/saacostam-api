import {
	type IGame,
	type IGameRepository,
	IGameStatus,
} from "@/apps/tic-tac-toe/features/game/domain";
import type { IUuidAdapter } from "@/apps/tic-tac-toe/shared/adapters/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class InMemoryGamesRepository implements IGameRepository {
	private games: IGame[] = [];

	constructor(private uuidAdapter: IUuidAdapter) {}

	async createGame(userId: string): Promise<IGame> {
		const game: IGame = {
			id: this.uuidAdapter.gen(),
			playerIds: [userId],
			turns: [],
			status: IGameStatus.STARTED,
			winnerPlayerId: null,
		};

		this.games.push(game);

		return game;
	}

	async getGameById(gameId: string): Promise<IGame | null> {
		const game = this.games.find(({ id }) => id === gameId);

		return game ?? null;
	}

	async getGamesByUserId(userId: string): Promise<IGame[]> {
		const userGames: IGame[] = [];

		for (const game of this.games) {
			if (game.playerIds.includes(userId)) {
				userGames.push(game);
			}
		}

		return userGames;
	}

	async getOpenGames(): Promise<IGame[]> {
		const openGames: IGame[] = [];

		for (const game of this.games) {
			if (game.playerIds.length < 2 && game.status === IGameStatus.STARTED) {
				openGames.push(game);
			}
		}

		return openGames;
	}

	async updateGameById(gameId: string, game: IGame): Promise<void> {
		const exists = this.games.find(({ id }) => id === gameId);

		if (!exists)
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				userMessage: "Game does not exist",
				message: `[GameRepositoryImpl] connot update game with id ${gameId}`,
			});

		this.games = this.games.map((g) => (g.id === exists.id ? game : g));
	}

	async removeGame(gameId: string): Promise<void> {
		this.games = this.games.filter((g) => g.id !== gameId);
	}
}
