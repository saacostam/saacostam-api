import type {
	Game,
	GameRepository,
} from "@/apps/bingo-tracker/features/game/domain";

export class MemoryGameRepository implements GameRepository {
	private games: Game[] = [];

	async create(game: Game): Promise<Game> {
		this.games.push(game);

		return game;
	}

	async delete(id: string): Promise<void> {
		this.games = this.games.filter((g) => g.id !== id);
	}

	async getAllByUserId(userId: string): Promise<Game[]> {
		return this.games.filter((g) => g.userId === userId);
	}

	async getById(id: string): Promise<Game | null> {
		const game = this.games.find((g) => g.id === id);

		return game ?? null;
	}

	async getByBoardTemplateId(boardTemplateId: string): Promise<Game | null> {
		const game = this.games.find((g) => g.boardTemplateId === boardTemplateId);

		return game ?? null;
	}
}
