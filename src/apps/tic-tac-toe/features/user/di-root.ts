import { uuidAdapter } from "@/apps/tic-tac-toe/shared/adapters/di-root";
import { UserUseCases } from "./app";
import { InMemoryUserRepository } from "./infra";

const userRepository = new InMemoryUserRepository(uuidAdapter);

export const userUseCases = new UserUseCases(userRepository);
