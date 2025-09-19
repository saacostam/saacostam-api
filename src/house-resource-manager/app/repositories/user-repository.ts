import type { User, UserWithHash } from "../../domain/entities";

export interface UserRepository {
	create(user: UserWithHash): Promise<User>;
	getById(id: string): Promise<User | undefined>;
	getUserWithHashByUsername(user: string): Promise<UserWithHash | undefined>;
	filterByUsername(username: string): Promise<User[]>;
}
