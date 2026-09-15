import {
	BcryptPasswordHasher,
	JwtTokenAdapter,
	MockErrorLogger,
	UuidGenerator,
} from "@/apps/bingo-tracker/shared/adapters/infra";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";

const errorLogger = new MockErrorLogger();
const jwtTokenAdapter = new JwtTokenAdapter();
const passwordHasherAdapter = new BcryptPasswordHasher();
const uuidGenIdAdapter = new UuidGenerator();

const _ctx: Context = {
	adapter: {
		errorLogger: errorLogger,
		idGen: uuidGenIdAdapter,
		token: jwtTokenAdapter,
		pwHasher: passwordHasherAdapter,
	},
};
