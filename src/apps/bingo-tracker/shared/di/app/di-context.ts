import type { GameRepository } from "@/apps/bingo-tracker/features/game/domain";
import type { UserRepository } from "@/apps/bingo-tracker/features/user/domain";
import type {
	DateAdapter,
	ErrorLogger,
	IdGenerator,
	PasswordHasher,
	TokenAdapter,
} from "@/apps/bingo-tracker/shared/adapters/domain";

export interface Context {
	adapter: {
		date: DateAdapter;
		errorLogger: ErrorLogger;
		idGen: IdGenerator;
		pwHasher: PasswordHasher;
		token: TokenAdapter;
	};
	repo: {
		game: GameRepository;
		user: UserRepository;
	};
}
