import type { ScratchBoard } from "../../domain/entities";

export interface ScratchBoardRepository {
	create(board: ScratchBoard): Promise<ScratchBoard>;
	deleteById(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<ScratchBoard[]>;
	getById(id: string): Promise<ScratchBoard | undefined>;
	updateById(id: string, board: ScratchBoard): Promise<ScratchBoard>;
}
