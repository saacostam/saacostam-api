export interface Play {
	id: string;
	gameId: string;
	name: string;
	startedAt: number;
	takenNumbers: number[];
	patterns: Pattern[];
}

export type Pattern = {
	id: string;
	body: boolean[][];
};
