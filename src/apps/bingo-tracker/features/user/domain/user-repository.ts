import type { User, UserWithPwHash } from "./user-entity";

/**
 * Data access abstraction over the user entity.
 *
 * Requires special care to ensure that hashed password details are not leaked.
 * This should be enforced primarily through tests. It is advised to create objects from scratch (e.g., avoid the spread operator).
 */
export interface UserRepository {
	create(user: UserWithPwHash): Promise<User>;
	getById(id: string): Promise<User | null>;
	getUserWithHashByUsername(username: string): Promise<UserWithPwHash | null>;
	filterByUsername(username: string): Promise<User[]>;
}
