import type {
	IGame,
	IGameRepository,
} from "@/apps/tic-tac-toe/features/game/domain";

export class GameUseCases {
	constructor(private gameRepo: IGameRepository) {}

	async queryOpenGames(): Promise<IGame[]> {
		return this.gameRepo.getOpenGames();
	}

	async queryUserGames(userId: string): Promise<{ game: IGame | null }> {
		const games = await this.gameRepo.getGamesByUserId(userId);

		if (games.length <= 0) {
			return {
				game: null,
			};
		}

		// biome-ignore lint/style/noNonNullAssertion: we check length above
		const lastGame = games.at(-1)!;

		return {
			game: lastGame,
		};
	}
}
