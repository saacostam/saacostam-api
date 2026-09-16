import type { Game } from "./game";

export interface GameRepository {
	create(game: Game): Promise<Game>;
	delete(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<Game[]>;
	getById(id: string): Promise<Game | null>;
}
