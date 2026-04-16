import { v4 as uuid } from "uuid";
import type { IGenIdAdapter } from "@/apps/monexo/shared/providers/domain";

export class UuidIdGeneratorAdapter implements IGenIdAdapter {
	gen(): string {
		return uuid();
	}
}
