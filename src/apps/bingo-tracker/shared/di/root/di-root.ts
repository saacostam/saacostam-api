import { AuthUseCases } from "@/apps/bingo-tracker/features/auth/app";
import { MemoryUserRepository } from "@/apps/bingo-tracker/features/user/infra";
import {
	BcryptPasswordHasher,
	JwtTokenAdapter,
	MockErrorLogger,
	UuidGenerator,
} from "@/apps/bingo-tracker/shared/adapters/infra";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { createWithAuth } from "@/apps/bingo-tracker/shared/middleware";

const errorLogger = new MockErrorLogger();
const jwtTokenAdapter = new JwtTokenAdapter();
const passwordHasherAdapter = new BcryptPasswordHasher();
const uuidGenIdAdapter = new UuidGenerator();

const userRepository = new MemoryUserRepository();

const ctx: Context = {
	adapter: {
		errorLogger: errorLogger,
		idGen: uuidGenIdAdapter,
		token: jwtTokenAdapter,
		pwHasher: passwordHasherAdapter,
	},
	repo: {
		user: userRepository,
	},
};

export const authUseCases = new AuthUseCases(ctx);

export const withAuth = createWithAuth(ctx.adapter.token);
