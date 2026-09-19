import type { Repository } from "@/apps/bingo-tracker/shared/repository";
import type { Game } from "./game";

export interface GameRepository extends Repository<Game> {
	getAllByUserId(userId: string): Promise<Game[]>;
}
