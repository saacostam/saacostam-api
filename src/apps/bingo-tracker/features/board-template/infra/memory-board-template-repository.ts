import type {
	BoardTemplate,
	BoardTemplateRepository,
} from "@/apps/bingo-tracker/features/board-template/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class MemoryBoardTemplateRepository implements BoardTemplateRepository {
	private boardTemplates: BoardTemplate[] = [];

	async create(boardTemplate: BoardTemplate): Promise<BoardTemplate> {
		this.boardTemplates.push(boardTemplate);

		return boardTemplate;
	}

	async delete(id: string): Promise<void> {
		this.boardTemplates = this.boardTemplates.filter((bt) => bt.id !== id);
	}

	async getById(id: string): Promise<BoardTemplate | null> {
		const bt = this.boardTemplates.find((bt) => bt.id === id);

		return bt ?? null;
	}

	async update(
		id: string,
		boardTemplate: BoardTemplate,
	): Promise<BoardTemplate> {
		const exists = this.boardTemplates.find((bt) => bt.id === id);

		if (!exists) {
			throw new BaseDomainError({
				type: DomainErrorType.NOT_FOUND,
				userMessage: "Board template does not exist",
				message: `[MemoryBoardTemplateRepository.update] cannot find board-template with id ${id}, when trying to update it`,
			});
		}

		this.boardTemplates.map((bt) => (bt.id === id ? boardTemplate : bt));

		return exists;
	}
}
