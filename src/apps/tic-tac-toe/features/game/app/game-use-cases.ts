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

const getGameNotFoundError = (args: { ctx: string; gameId: string }) => {
	return new BaseDomainError({
		type: DomainErrorType.NOT_FOUND,
		userMessage: "Game not found",
		message: `[GameUseCases.${args.ctx}] game with id ${args.gameId} not found`,
	});
};

const getUserNotFoundError = (args: { ctx: string; userId: string }) => {
	return new BaseDomainError({
		type: DomainErrorType.NOT_FOUND,
		message: `[GameUseCases.${args.ctx}] User with id ${args.userId} not found`,
		userMessage: "User not found",
	});
};

export class GameUseCases {
	constructor(
		private eventAdapter: IEventAdapter,
		private userRepo: IUserRepository,
		private gameRepo: IGameRepository,
	) {}

	async createGame(userId: string): Promise<void> {
		const user = await this.userRepo.getUserById({ id: userId });

		if (!user) {
			throw getUserNotFoundError({
				ctx: "createGame",
				userId,
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

	async joinGame(userId: string, gameId: string): Promise<void> {
		const user = await this.userRepo.getUserById({ id: userId });

		if (!user) {
			throw getUserNotFoundError({
				ctx: "joinGame",
				userId,
			});
		}

		const gamesByUser = await this.gameRepo.getGamesByUserId(user.id);
		const openGame = gamesByUser.find(gameService.isOpen);
		if (openGame) {
			throw new BaseDomainError({
				userMessage: "User already has a game in progress",
				message: `[GameUseCases.joinGame] user by id ${userId} has an open game`,
				type: DomainErrorType.CONFLICT,
			});
		}

		const game = await this.gameRepo.getGameById(gameId);
		if (!game) {
			throw getGameNotFoundError({
				ctx: "joinGame",
				gameId,
			});
		}

		if (game.status === IGameStatus.FINISHED) {
			throw new BaseDomainError({
				message: `[GameUseCases.joinGame] attempting to join game with id ${gameId} that has already finished`,
				userMessage: "Cannot join this game — it has already finished",
				type: DomainErrorType.CONFLICT,
			});
		}

		const isOpen = gameService.isOpen(game);
		if (!isOpen) {
			throw new BaseDomainError({
				userMessage: "Cannot join game, already full",
				message: `[GameUseCases.joinGame] game by id ${gameId} already full`,
				type: DomainErrorType.CONFLICT,
			});
		}

		// Update State
		game.userIds.push(userId);
		await this.gameRepo.updateGameById(game.id, game);

		// Send event
		void Promise.allSettled(
			game.userIds.map((id) =>
				this.eventAdapter.publish(id, IEventType.USER_GAME_CHANGED),
			),
		);
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
			throw getGameNotFoundError({
				ctx: "sendTurn",
				gameId: args.gameId,
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
