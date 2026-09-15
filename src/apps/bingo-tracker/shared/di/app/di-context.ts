import type {
	ErrorLogger,
	IdGenerator,
	PasswordHasher,
	TokenAdapter,
} from "@/apps/bingo-tracker/shared/adapters/domain";

export interface Context {
	adapter: {
		errorLogger: ErrorLogger;
		idGen: IdGenerator;
		pwHasher: PasswordHasher;
		token: TokenAdapter;
	};
}
