import type { IUserRepository } from "@/apps/tic-tac-toe/features/user/domain";

export class UserUseCases {
	constructor(private userRepo: IUserRepository) {}

	async addUser(args: { name: string }): Promise<string> {
		const user = await this.userRepo.createUser({ name: args.name });

		return user.id;
	}
}
