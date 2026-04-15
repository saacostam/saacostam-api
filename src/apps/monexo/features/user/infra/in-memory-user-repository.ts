import type {
	IUser,
	IUserRepository,
	IUserWithHash,
} from "@/apps/monexo/features/user/domain";

export class InMemoryUserRepository implements IUserRepository {
	private users: IUserWithHash[] = [];

	async create(user: IUserWithHash): Promise<IUser> {
		this.users.push(user);

		return {
			id: user.id,
			username: user.username,
		};
	}

	async getById(id: string): Promise<IUser | null> {
		const userWithHash = this.users.find((u) => u.id === id);

		if (userWithHash === undefined) return null;

		return {
			id: userWithHash.id,
			username: userWithHash.username,
		};
	}

	async getUserWithHashByUsername(
		username: string,
	): Promise<IUserWithHash | null> {
		const userWithHash = this.users.find((u) => u.username === username);

		return userWithHash ?? null;
	}
}
