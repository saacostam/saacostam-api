import type { Collection } from "mongodb";
import type {
	Game,
	GameRepository,
} from "@/apps/bingo-tracker/features/game/domain";
import { bingoTrackingDb } from "@/apps/bingo-tracker/shared/mongo";

interface GameDocument {
	_id: string;
	boardTemplateId: string;
	name: string;
	createdAt: number;
	userId: string;
}

const gamesCollection: Collection<GameDocument> =
	bingoTrackingDb.collection("games");

export class MongoGameRepository implements GameRepository {
	async create(game: Game): Promise<Game> {
		await gamesCollection.insertOne({
			_id: game.id,
			boardTemplateId: game.boardTemplateId,
			name: game.name,
			createdAt: game.createdAt,
			userId: game.userId,
		});

		return game;
	}

	async delete(id: string): Promise<void> {
		await gamesCollection.deleteOne({
			_id: id,
		});
	}

	async getAllByUserId(userId: string): Promise<Game[]> {
		const games = await gamesCollection
			.find({
				userId,
			})
			.toArray();

		return games.map(this.mapToDomain);
	}

	async getById(id: string): Promise<Game | null> {
		const game = await gamesCollection.findOne({
			_id: id,
		});

		if (game === null) {
			return null;
		}

		return this.mapToDomain(game);
	}

	async getByBoardTemplateId(boardTemplateId: string): Promise<Game | null> {
		const game = await gamesCollection.findOne({
			boardTemplateId,
		});

		if (game === null) {
			return null;
		}

		return this.mapToDomain(game);
	}

	private mapToDomain(game: GameDocument): Game {
		return {
			id: game._id,
			boardTemplateId: game.boardTemplateId,
			name: game.name,
			createdAt: game.createdAt,
			userId: game.userId,
		};
	}
}
