import { GameUseCases } from "@/apps/tic-tac-toe/features/game/app";
import { InMemoryGamesRepository } from "@/apps/tic-tac-toe/features/game/infra";
import { UserUseCases } from "@/apps/tic-tac-toe/features/user/app";
import { InMemoryUserRepository } from "@/apps/tic-tac-toe/features/user/infra";
import {
	UuidAdapterImpl,
	WsEventAdapter,
} from "@/apps/tic-tac-toe/shared/adapters/infra";

export const wsEventAdapter = new WsEventAdapter();
export const uuidAdapter = new UuidAdapterImpl();

export const inMemoryGameRepository = new InMemoryGamesRepository(uuidAdapter);
export const isMemoryUserRepository = new InMemoryUserRepository(uuidAdapter);

export const userUseCases = new UserUseCases(
	inMemoryGameRepository,
	isMemoryUserRepository,
	wsEventAdapter,
);
export const gameUseCases = new GameUseCases(
	wsEventAdapter,
	isMemoryUserRepository,
	inMemoryGameRepository,
);
