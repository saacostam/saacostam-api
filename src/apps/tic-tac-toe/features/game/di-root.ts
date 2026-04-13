import { userRepository } from "@/apps/tic-tac-toe/features/user/di-root";
import {
	uuidAdapter,
	wsEventAdaper,
} from "@/apps/tic-tac-toe/shared/adapters/di-root";
import { GameUseCases } from "./app";
import { InMemoryGamesRepository } from "./infra";

const gameRepository = new InMemoryGamesRepository(uuidAdapter);

export const gameUseCases = new GameUseCases(
	wsEventAdaper,
	userRepository,
	gameRepository,
);
