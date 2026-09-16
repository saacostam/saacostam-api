import type { DateAdapter } from "@/apps/bingo-tracker/shared/adapters/domain";

export class VanillaDateAdapter implements DateAdapter {
	now(): number {
		return Date.now();
	}
}
