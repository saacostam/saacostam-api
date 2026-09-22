import type {
	Play,
	PlayRepository,
} from "@/apps/bingo-tracker/features/play/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class MemoryPlayRepository implements PlayRepository {
	private plays: Play[] = [];

	async create(play: Play): Promise<Play> {
		this.plays.push(play);

		return play;
	}

	async delete(id: string): Promise<void> {
		this.plays = this.plays.filter((b) => b.id !== id);
	}

	async getAllByGameIdList(gameIdList: string[]): Promise<Play[]> {
		return this.plays.filter((b) => {
			gameIdList.includes(b.gameId);
		});
	}

	async getById(id: string): Promise<Play | null> {
		const play = this.plays.find((b) => b.id === id);

		return play ?? null;
	}

	async updateById(id: string, play: Play): Promise<Play> {
		const exists = this.plays.find((b) => b.id === id);

		if (!exists) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				message: `[MemoryPlayRepository.updateById] Play with id ${id} was not found`,
				userMessage: "Trying to update a play which doesn't exist",
			});
		}

		this.plays = this.plays.map((b) => (b.id === id ? play : b));

		return play;
	}
}
