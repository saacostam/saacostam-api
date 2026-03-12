import { v4 } from "uuid";
import type { IUuidProvider } from "@/projects/analytics/app";

export class SimpleUuidProvider implements IUuidProvider {
	gen(): string {
		return v4();
	}
}
