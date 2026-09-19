import { AuthUseCases } from "@/apps/bingo-tracker/features/auth/app";
import { MemoryBoardTemplateRepository } from "@/apps/bingo-tracker/features/board-template/infra";
import { GameUseCases } from "@/apps/bingo-tracker/features/game/app";
import { MemoryGameRepository } from "@/apps/bingo-tracker/features/game/infra";
import { UserUseCases } from "@/apps/bingo-tracker/features/user/app";
import { MemoryUserRepository } from "@/apps/bingo-tracker/features/user/infra";
import {
	BcryptPasswordHasher,
	JwtTokenAdapter,
	MockErrorLogger,
	UuidGenerator,
	VanillaDateAdapter,
} from "@/apps/bingo-tracker/shared/adapters/infra";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { createWithAuth } from "@/apps/bingo-tracker/shared/middleware";

const dateAdapter = new VanillaDateAdapter();
const errorLogger = new MockErrorLogger();
const jwtTokenAdapter = new JwtTokenAdapter();
const passwordHasherAdapter = new BcryptPasswordHasher();
const uuidGenIdAdapter = new UuidGenerator();

const boardTemplateRepository = new MemoryBoardTemplateRepository();
const gameRepository = new MemoryGameRepository();
const userRepository = new MemoryUserRepository();

const ctx: Context = {
	adapter: {
		date: dateAdapter,
		errorLogger: errorLogger,
		idGen: uuidGenIdAdapter,
		token: jwtTokenAdapter,
		pwHasher: passwordHasherAdapter,
	},
	repo: {
		boardTemplate: boardTemplateRepository,
		game: gameRepository,
		user: userRepository,
	},
};

export const authUseCases = new AuthUseCases(ctx);
export const gameUseCases = new GameUseCases(ctx);
export const userUseCases = new UserUseCases(ctx);

export const withAuth = createWithAuth(ctx.adapter.token);
