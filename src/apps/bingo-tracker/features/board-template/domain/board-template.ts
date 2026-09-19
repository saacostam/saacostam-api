export interface BoardTemplate {
	id: string;
	grid: BoardTemplateCell[][];
	boardRange: BoardRange;
}

export type BoardTemplateCell =
	| {
			type: "blocked";
	  }
	| {
			type: "available";
	  };

export interface BoardRange {
	min: number;
	max: number;
}
