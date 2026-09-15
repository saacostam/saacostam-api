import { v4 as uuid } from "uuid";
import type { IdGenerator } from "@/apps/bingo-tracker/shared/adapters/domain";

export class UuidGenerator implements IdGenerator {
	gen(): string {
		return uuid();
	}
}
