import type { User } from "@/apps/bingo-tracker/features/user/domain";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class UserUseCases {
	constructor(private ctx: Context) {}

	async getUser(id: string): Promise<User> {
		const user = await this.ctx.repo.user.getById(id);

		if (!user) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				message: `[UserUseCases.getUser] User with id ${id} was not found`,
				userMessage: "User not found",
			});
		}

		return user;
	}
}
