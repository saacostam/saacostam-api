import { uuidAdapter } from "@/apps/tic-tac-toe/shared/adapters/di-root";
import { GameUseCases } from "./app";
import { InMemoryGamesRepository } from "./infra";

const gameRepository = new InMemoryGamesRepository(uuidAdapter);

export const gameUseCases = new GameUseCases(gameRepository);
