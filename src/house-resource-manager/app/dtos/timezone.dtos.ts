export class QueryGetTimezonesOutDto {
	constructor(
		public countries: {
			country: {
				name: string;
				code: string;
			};
			zones: {
				name: string;
				comments: string;
			}[];
		}[],
	) {}
}
