import type { Board } from "@/apps/hrm/domain";

export interface BoardRepository {
	create(board: Board): Promise<Board>;
	deleteById(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<Board[]>;
	getById(id: string): Promise<Board | undefined>;
	updateById(id: string, board: Board): Promise<Board>;
}
