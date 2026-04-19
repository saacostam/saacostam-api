export interface IErrorLoggerProvider {
	log(
		e: unknown,
		ctx?: {
			where?: string;
		},
	): void;
}
