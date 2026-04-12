export interface ITurn {
	playerId: string;
	x: number;
	y: number;
}

export enum IGameStatus {
	STARTED = "STARTED",
	FINISHED = "FINISHED",
}

export interface IGame {
	id: string;
	playerIds: string[];
	turns: ITurn[];
	status: IGameStatus;
	winnerPlayerId: string | null;
}
