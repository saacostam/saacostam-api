import type { Repository } from "@/apps/bingo-tracker/shared/repository";
import type { Play } from "./play";

export interface PlayRepository extends Repository<Play> {
	getAllByGameIdList(gameIdList: string[]): Promise<Play[]>;
	updateById(id: string, board: Play): Promise<Play>;
}
