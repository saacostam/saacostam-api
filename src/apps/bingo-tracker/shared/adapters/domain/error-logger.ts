export interface ErrorLogger {
	log(
		e: unknown,
		ctx?: {
			where?: string;
		},
	): void;
}
