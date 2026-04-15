import { UserUseCases } from "@/apps/monexo/features/user/app";
import { InMemoryUserRepository } from "@/apps/monexo/features/user/infra";
import type { IContext } from "@/apps/monexo/shared/di/app";

const inMemoryUserRepository = new InMemoryUserRepository();

const ctx: IContext = {
	repo: {
		user: inMemoryUserRepository,
	},
};

export const userUseCases = new UserUseCases(ctx);
