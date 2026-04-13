import type { IGame } from "./game-entity";

class GameService {
	public static MAX_PLAYERS = 2;

	isOpen(game: IGame): boolean {
		return game.userIds.length < GameService.MAX_PLAYERS;
	}
}

export const gameService = new GameService();
