import type { IDateProvider } from "@/apps/analytics/app";

export class SimpleDateProvider implements IDateProvider {
	now(): Date {
		return new Date();
	}
}
