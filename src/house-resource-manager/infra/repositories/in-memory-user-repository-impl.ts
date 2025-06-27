import { User } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";

const USERS: User[] = [
    new User(
        "default-user",
        "saacostam",
        "Santiago",
        "Acosta meza",
    )
]

export class InMemoryUserRepositoryImpl implements UserRepository {
    create(user: User): Promise<User> {
        USERS.push(user);

        return new Promise((res) => res(user));
    }

    getAll(): Promise<User[]> {
        return new Promise((res) => res(USERS));
    }

    getById(id: string): Promise<User | undefined> {
        const user = USERS.find(u => u.id === id);

        return new Promise((res) => res(user));
    }
}
