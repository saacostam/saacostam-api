import type { IErrorLoggerProvider } from "@/apps/monexo/shared/providers/domain";

export class ErrorLoggerProviderImpl implements IErrorLoggerProvider {
	log(e: unknown, _ctx?: { where?: string }): void {
		console.error(e);
	}
}
