import type { Repository } from "@/apps/bingo-tracker/shared/repository";
import type { BoardTemplate } from "./board-template";

export interface BoardTemplateRepository extends Repository<BoardTemplate> {
	update(id: string, boardTemplate: BoardTemplate): Promise<BoardTemplate>;
}
