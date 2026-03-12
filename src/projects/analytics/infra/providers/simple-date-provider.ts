import type { IDateProvider } from "@/projects/analytics/app";

export class SimpleDateProvider implements IDateProvider {
	now(): Date {
		return new Date();
	}
}
