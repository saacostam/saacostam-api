import type {
	IUser,
	IUserRepository,
} from "@/apps/tic-tac-toe/features/user/domain";
import type { IUuidAdapter } from "@/apps/tic-tac-toe/shared/adapters/domain";

export class InMemoryUserRepository implements IUserRepository {
	private users: IUser[] = [];

	constructor(private uuidAdapter: IUuidAdapter) {}

	async createUser(args: { name: string }): Promise<IUser> {
		const user: IUser = {
			id: this.uuidAdapter.gen(),
			name: args.name,
		};

		this.users.push(user);

		return user;
	}

	async getUserById(args: { id: string }): Promise<IUser | null> {
		const user = this.users.find(({ id }) => id === args.id);

		return user ?? null;
	}

	async removeUser(args: { id: string }): Promise<void> {
		this.users = this.users.filter(({ id }) => id !== args.id);
	}
}
