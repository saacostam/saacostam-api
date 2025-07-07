import { UserRepository } from "../../app/repositories";
import { User, UserWithHash } from "../../domain/entities";

const USERS: UserWithHash[] = [
    new UserWithHash(
        "9227a66c-34ca-4339-a224-c2b1d71c3c26",
        "saacostam",
        "Santiago",
        "Acosta meza",
        "$2b$10$r7mtcFnMtaGGfzXWRE05TO6rsjUilCPuvMLfbVWsRr90UriIR/yy.",
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

        return new Promise((res) => res(user ? new User(user.id, user.username, user.firstName, user.lastName) : undefined));
    }

    getUserWithHashByUsername(username: string): Promise<UserWithHash | undefined> {
        const user = USERS.find(u => u.username === username);

        return new Promise((res) => res(user));
    }

    filterByUsername(username: string): Promise<User[]> {
        return new Promise((res) => res(USERS.filter(u => u.username === username)));
    }
}
