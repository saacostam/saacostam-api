import type { ErrorLogger } from "@/apps/bingo-tracker/shared/providers/domain";

export class MockErrorLogger implements ErrorLogger {
	log(e: unknown, _ctx?: { where?: string }): void {
		console.error(e);
	}
}
