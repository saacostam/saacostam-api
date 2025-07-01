import { User, UserWithHash } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";

const USERS: UserWithHash[] = [
    new UserWithHash(
        "default-user",
        "saacostam",
        "Santiago",
        "Acosta meza",
        "something",
    )
]

export class InMemoryUserRepositoryImpl implements UserRepository {
    create(user: UserWithHash): Promise<User> {
        USERS.push(user);

        return new Promise((res) => res(new User(
            user.id,
            user.username,
            user.firstName,
            user.lastName,
        )));
    }

    getAll(): Promise<User[]> {
        return new Promise((res) => res(USERS));
    }

    getById(id: string): Promise<User | undefined> {
        const user = USERS.find(u => u.id === id);

        return new Promise((res) => res(user));
    }

    filterByUsername(username: string): Promise<User[]> {
        return new Promise((res) => res(USERS.filter(u => u.username === username)));
    }
}
