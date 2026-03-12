import { v4 } from "uuid";
import type { IUuidProvider } from "@/apps/analytics/app";

export class SimpleUuidProvider implements IUuidProvider {
	gen(): string {
		return v4();
	}
}
