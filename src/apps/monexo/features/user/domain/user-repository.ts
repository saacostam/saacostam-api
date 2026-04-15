import type { IUser, IUserWithHash } from "@/apps/monexo/features/user/domain";

/**
 * Data access abstraction over the user entity.
 *
 * Requires special care to ensure that hashed password details are not leaked.
 * This should be enforced primarily through tests. It is advised to create objects from scratch (e.g., avoid the spread operator).
 */
export interface IUserRepository {
	create(user: IUserWithHash): Promise<IUser>;
	getById(id: string): Promise<IUser | null>;
	getUserWithHashByUsername(username: string): Promise<IUserWithHash | null>;
}
