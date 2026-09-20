export interface Board {
	id: string;
	name: string;
	values: (number | undefined)[][];
	gameId: string;
}
