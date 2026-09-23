import type { BoardRepository } from "@/apps/bingo-tracker/features/board/domain";
import type { BoardTemplateRepository } from "@/apps/bingo-tracker/features/board-template/domain";
import type { GameRepository } from "@/apps/bingo-tracker/features/game/domain";
import type { PlayRepository } from "@/apps/bingo-tracker/features/play/domain";
import type { UserRepository } from "@/apps/bingo-tracker/features/user/domain";
import type {
	DateAdapter,
	ErrorLogger,
	IdGenerator,
	PasswordHasher,
	TokenAdapter,
	VisionProvider,
} from "@/apps/bingo-tracker/shared/adapters/domain";

export interface Context {
	adapter: {
		date: DateAdapter;
		errorLogger: ErrorLogger;
		idGen: IdGenerator;
		pwHasher: PasswordHasher;
		token: TokenAdapter;
		vision: VisionProvider;
	};
	repo: {
		board: BoardRepository;
		boardTemplate: BoardTemplateRepository;
		game: GameRepository;
		play: PlayRepository;
		user: UserRepository;
	};
}
