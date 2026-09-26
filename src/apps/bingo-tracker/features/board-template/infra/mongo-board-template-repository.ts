import type { Collection } from "mongodb";
import type {
	BoardTemplate,
	BoardTemplateRepository,
} from "@/apps/bingo-tracker/features/board-template/domain";
import { bingoTrackingDb } from "@/apps/bingo-tracker/shared/mongo";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

interface BoardTemplateDocument {
	_id: string;
	grid: BoardTemplate["grid"];
	boardRange: BoardTemplate["boardRange"];
}

const boardTemplatesCollection: Collection<BoardTemplateDocument> =
	bingoTrackingDb.collection("board-templates");

export class MongoBoardTemplateRepository implements BoardTemplateRepository {
	async create(boardTemplate: BoardTemplate): Promise<BoardTemplate> {
		await boardTemplatesCollection.insertOne({
			_id: boardTemplate.id,
			grid: boardTemplate.grid,
			boardRange: boardTemplate.boardRange,
		});

		return boardTemplate;
	}

	async delete(id: string): Promise<void> {
		await boardTemplatesCollection.deleteOne({
			_id: id,
		});
	}

	async getById(id: string): Promise<BoardTemplate | null> {
		const boardTemplate = await boardTemplatesCollection.findOne({
			_id: id,
		});

		if (boardTemplate === null) {
			return null;
		}

		return this.mapToDomain(boardTemplate);
	}

	async update(
		id: string,
		boardTemplate: BoardTemplate,
	): Promise<BoardTemplate> {
		const result = await boardTemplatesCollection.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					grid: boardTemplate.grid,
					boardRange: boardTemplate.boardRange,
				},
			},
		);

		if (result.matchedCount === 0) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				userMessage: "Board template does not exist",
				message: `[MongoBoardTemplateRepository.update] cannot find board-template with id ${id}, when trying to update it`,
			});
		}

		return boardTemplate;
	}

	private mapToDomain(boardTemplate: BoardTemplateDocument): BoardTemplate {
		return {
			id: boardTemplate._id,
			grid: boardTemplate.grid,
			boardRange: boardTemplate.boardRange,
		};
	}
}
