import type { IDateProvider } from "../../app";

export class SimpleDateProvider implements IDateProvider {
	now(): Date {
		return new Date();
	}
}
