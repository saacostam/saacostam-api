import {
	gameService,
	type IGame,
	type IGameRepository,
	IGameStatus,
	type ITurn,
} from "@/apps/tic-tac-toe/features/game/domain";
import type { IUserRepository } from "@/apps/tic-tac-toe/features/user/domain";
import {
	type IEventAdapter,
	IEventType,
} from "@/apps/tic-tac-toe/shared/adapters/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class GameUseCases {
	constructor(
		private eventAdapter: IEventAdapter,
		private userRepo: IUserRepository,
		private gameRepo: IGameRepository,
	) {}

	async createGame(userId: string): Promise<void> {
		const user = await this.userRepo.getUserById({ id: userId });

		if (!user) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				message: `[GameUseCases.createGame] User with id ${userId} not found`,
				userMessage: "User not found",
			});
		}

		const gamesByUser = await this.gameRepo.getGamesByUserId(userId);
		const hasOpenGame = gamesByUser.find(gameService.isOpen);

		if (hasOpenGame) {
			throw new BaseDomainError({
				type: DomainErrorType.CONFLICT,
				userMessage: "User already has a game in progress",
				message: `[GameUseCases.createGame] User by id ${userId} has an open game`,
			});
		}

		await this.gameRepo.createGame(userId);

		void this.eventAdapter.broadcast(IEventType.GAMES_CHANGED);
	}

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

	async sendTurn(args: {
		gameId: string;
		userId: string;
		x: number;
		y: number;
	}): Promise<void> {
		let game = await this.gameRepo.getGameById(args.gameId);

		if (!game) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				userMessage: "Game not found",
				message: `[GameUseCases.sendTurn] game with id ${args.gameId} not found`,
			});
		}

		// Valid state
		if (game.userIds.length < 2 || game.status === IGameStatus.FINISHED) {
			throw new BaseDomainError({
				type: DomainErrorType.CONFLICT,
				userMessage: "Game is not in playable state",
				message: `[GameUseCases.sendTurn] game with id ${args.gameId} can't apply a turn as it is in invalid state`,
			});
		}

		const turn: ITurn = {
			x: args.x,
			y: args.y,
			playerId: args.userId,
		};
		game = gameService.applyTurn(game, turn);

		// Check Win Condition
		const checWin = gameService.checkWinCondition(game);
		if (checWin.hasWinCondition) {
			game.status = IGameStatus.FINISHED;
			game.winnerPlayerId = checWin.winnerUserId;
		}

		// Update State
		await this.gameRepo.updateGameById(game.id, game);

		// Send event
		void Promise.allSettled(
			game.userIds.map((id) =>
				this.eventAdapter.publish(id, IEventType.USER_GAME_CHANGED),
			),
		);
	}
}
