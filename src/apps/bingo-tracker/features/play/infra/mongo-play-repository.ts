import type { Collection } from "mongodb";
import type {
	Play,
	PlayRepository,
} from "@/apps/bingo-tracker/features/play/domain";
import { bingoTrackingDb } from "@/apps/bingo-tracker/shared/mongo";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

interface PlayDocument {
	_id: string;
	gameId: string;
	name: string;
	startedAt: number;
	takenNumbers: number[];
	patterns: Play["patterns"];
}

const playsCollection: Collection<PlayDocument> =
	bingoTrackingDb.collection("plays");

export class MongoPlayRepository implements PlayRepository {
	async create(play: Play): Promise<Play> {
		await playsCollection.insertOne({
			_id: play.id,
			gameId: play.gameId,
			name: play.name,
			startedAt: play.startedAt,
			takenNumbers: play.takenNumbers,
			patterns: play.patterns,
		});

		return play;
	}

	async delete(id: string): Promise<void> {
		await playsCollection.deleteOne({
			_id: id,
		});
	}

	async getAllByGameIdList(gameIdList: string[]): Promise<Play[]> {
		const plays = await playsCollection
			.find({
				gameId: {
					$in: gameIdList,
				},
			})
			.toArray();

		return plays.map(this.mapToDomain);
	}

	async getById(id: string): Promise<Play | null> {
		const play = await playsCollection.findOne({
			_id: id,
		});

		if (play === null) {
			return null;
		}

		return this.mapToDomain(play);
	}

	async updateById(id: string, play: Play): Promise<Play> {
		const result = await playsCollection.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					gameId: play.gameId,
					name: play.name,
					startedAt: play.startedAt,
					takenNumbers: play.takenNumbers,
					patterns: play.patterns,
				},
			},
		);

		if (result.matchedCount === 0) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				message: `[MongoPlayRepository.updateById] Play with id ${id} was not found`,
				userMessage: "Trying to update a play which doesn't exist",
			});
		}

		return play;
	}

	private mapToDomain(play: PlayDocument): Play {
		return {
			id: play._id,
			gameId: play.gameId,
			name: play.name,
			startedAt: play.startedAt,
			takenNumbers: play.takenNumbers,
			patterns: play.patterns,
		};
	}
}
