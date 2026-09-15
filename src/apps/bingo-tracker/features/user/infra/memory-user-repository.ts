import type {
	User,
	UserRepository,
	UserWithPwHash,
} from "@/apps/bingo-tracker/features/user/domain";

export class MemoryUserRepository implements UserRepository {
	private users: UserWithPwHash[] = [];

	async create(user: UserWithPwHash): Promise<User> {
		this.users.push(user);

		return {
			id: user.id,
			username: user.username,
		};
	}

	async getById(id: string): Promise<User | null> {
		const user = this.users.find((u) => u.id === id);

		if (user === undefined) return null;

		return {
			id: user.id,
			username: user.username,
		};
	}

	async getUserWithHashByUsername(
		username: string,
	): Promise<UserWithPwHash | null> {
		const user = this.users.find((u) => u.username === username);
		return user ?? null;
	}

	async filterByUsername(username: string): Promise<User[]> {
		const filteredUsers = this.users.filter((u) => u.username === username);

		return filteredUsers.map((u) => ({
			id: u.id,
			username: u.username,
		}));
	}
}
