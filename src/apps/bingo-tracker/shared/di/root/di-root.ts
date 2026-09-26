import { MongoAllowListRepository } from "@/apps/bingo-tracker/features/allow-list/infra";
import { AuthUseCases } from "@/apps/bingo-tracker/features/auth/app";
import { BoardUseCases } from "@/apps/bingo-tracker/features/board/app";
import { MongoBoardRepository } from "@/apps/bingo-tracker/features/board/infra";
import { MongoBoardTemplateRepository } from "@/apps/bingo-tracker/features/board-template/infra";
import { GameUseCases } from "@/apps/bingo-tracker/features/game/app";
import { MongoGameRepository } from "@/apps/bingo-tracker/features/game/infra";
import { PlayUseCases } from "@/apps/bingo-tracker/features/play/app";
import { MongoPlayRepository } from "@/apps/bingo-tracker/features/play/infra";
import { UserUseCases } from "@/apps/bingo-tracker/features/user/app";
import { MongoUserRepository } from "@/apps/bingo-tracker/features/user/infra";
import {
	BcryptPasswordHasher,
	JwtTokenAdapter,
	MockErrorLogger,
	MockVisionProvider,
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
const visionProvider = new MockVisionProvider();

const allowListRepository = new MongoAllowListRepository();
const boardRepository = new MongoBoardRepository();
const boardTemplateRepository = new MongoBoardTemplateRepository();
const gameRepository = new MongoGameRepository();
const playRepository = new MongoPlayRepository();
const userRepository = new MongoUserRepository();

const ctx: Context = {
	adapter: {
		date: dateAdapter,
		errorLogger: errorLogger,
		idGen: uuidGenIdAdapter,
		token: jwtTokenAdapter,
		pwHasher: passwordHasherAdapter,
		vision: visionProvider,
	},
	repo: {
		allowList: allowListRepository,
		board: boardRepository,
		boardTemplate: boardTemplateRepository,
		game: gameRepository,
		play: playRepository,
		user: userRepository,
	},
};

export const authUseCases = new AuthUseCases(ctx);
export const boardUseCases = new BoardUseCases(ctx);
export const gameUseCases = new GameUseCases(ctx);
export const playUseCases = new PlayUseCases(ctx);
export const userUseCases = new UserUseCases(ctx);

export const withAuth = createWithAuth(ctx.adapter.token);
