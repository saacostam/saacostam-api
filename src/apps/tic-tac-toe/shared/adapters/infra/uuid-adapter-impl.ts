import { v4 as uuid } from "uuid";
import type { IUuidAdapter } from "@/apps/tic-tac-toe/shared/adapters/domain";

export class UuidAdapterImpl implements IUuidAdapter {
	gen(): string {
		return uuid();
	}
}
