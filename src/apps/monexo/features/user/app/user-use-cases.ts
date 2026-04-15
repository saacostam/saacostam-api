import type { IUser } from "@/apps/monexo/features/user/domain";
import type { IContext } from "@/apps/monexo/shared/di/app";
import { errorFactory } from "@/apps/monexo/shared/errors";

export class UserUseCases {
	constructor(private ctx: IContext) {}

	async getUser(id: string): Promise<IUser> {
		const user = await this.ctx.repo.user.getById(id);

		if (!user) {
			throw errorFactory.userByIdNotFound({
				id,
				ctx: "UserUseCases.getUser",
			});
		}

		return user;
	}
}
