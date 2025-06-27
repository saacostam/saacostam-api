import { User } from "../entities";

export interface UserRepository {
    create(user: User): Promise<User>;
    getAll(): Promise<User[]>
    getById(id: string): Promise<User | undefined>
}
