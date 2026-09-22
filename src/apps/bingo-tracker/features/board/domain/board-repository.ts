import type { Repository } from "@/apps/bingo-tracker/shared/repository";
import type { Board } from "./board";

export interface BoardRepository extends Repository<Board> {
	getAllByIdList(idList: string[]): Promise<Board[]>;
	getAllByGameId(gameId: string): Promise<Board[]>;
	updateById(id: string, board: Board): Promise<Board>;
}
