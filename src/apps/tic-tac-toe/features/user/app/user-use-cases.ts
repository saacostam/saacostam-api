import type {
	IGame,
	IGameRepository,
} from "@/apps/tic-tac-toe/features/game/domain";
import type { IUserRepository } from "@/apps/tic-tac-toe/features/user/domain";
import {
	type IEventAdapter,
	IEventType,
} from "@/apps/tic-tac-toe/shared/adapters/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class UserUseCases {
	constructor(
		private gameRepo: IGameRepository,
		private userRepo: IUserRepository,
		private eventAdapter: IEventAdapter,
	) {}

	async addUser(args: { name: string }): Promise<string> {
		const user = await this.userRepo.createUser({ name: args.name });

		return user.id;
	}

	async removeUser(userId: string): Promise<void> {
		const user = await this.userRepo.getUserById({ id: userId });
		if (!user) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				message: `[UserUseCases.removeUser] User with id ${userId} not found`,
				userMessage: "User not found",
			});
		}

		const gamesByUserId = await this.gameRepo.getGamesByUserId(user.id);

		// Clean up each game state
		const closeGame = async (game: IGame) => {
			// Remove game
			await this.gameRepo.removeGame(game.id);

			// Notify players
			void Promise.allSettled(
				game.userIds.map((userId) =>
					this.eventAdapter.publish(userId, IEventType.USER_GAME_REMOVED),
				),
			);
		};
		void Promise.allSettled(gamesByUserId.map((game) => closeGame(game)));

		if (gamesByUserId.length > 0)
			void this.eventAdapter.broadcast(IEventType.GAMES_CHANGED);

		await this.userRepo.removeUser({ id: userId });
	}
}
