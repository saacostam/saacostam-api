import type { IUser } from "./user-entity";

export interface IUserRepository {
	createUser(args: { name: string }): Promise<IUser>;
	getUserById(args: { id: string }): Promise<IUser | null>;
	removeUser(args: { id: string }): Promise<void>;
}
