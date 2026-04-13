export interface ITurn {
	playerId: string;
	x: number;
	y: number;
}

export enum IGameStatus {
	STARTED = "started",
	FINISHED = "finished",
}

export interface IGame {
	id: string;
	userIds: string[];
	turns: ITurn[];
	status: IGameStatus;
	winnerPlayerId: string | null;
}
