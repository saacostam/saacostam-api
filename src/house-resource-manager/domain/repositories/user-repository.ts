import { User, UserWithHash } from "../entities";

export interface UserRepository {
    create(user: UserWithHash): Promise<User>;
    getAll(): Promise<User[]>;
    getById(id: string): Promise<User | undefined>;
    getUserWithHashByUsername(id: string): Promise<UserWithHash | undefined>;
    filterByUsername(username: string): Promise<User[]>;
}
