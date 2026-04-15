import type { IUserRepository } from "@/apps/monexo/features/user/domain";

export interface IContext {
	repo: {
		user: IUserRepository;
	};
}
