import type { Board } from "@/apps/bingo-tracker/features/board/domain";
import type { BoardTemplate } from "@/apps/bingo-tracker/features/board-template/domain";

export interface Game {
	id: string;
	boardTemplateId: string;
	name: string;
	createdAt: number;
	userId: string;
}

export type WithBoards<G> = G & {
	boards: Board[];
};

export type WithBoardTemplate<G> = G & {
	boardTemplate: BoardTemplate;
};
