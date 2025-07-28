import type { Category } from "./category";
import type { Resource } from "./resource";
import type { User } from "./user";

export class Task {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly description: string | null,
		public readonly priority: "low" | "medium" | "high",
		public readonly resourcesIds: Resource["id"][],
		public readonly categoryId: Category["id"],
		public readonly cadence: string,
		public readonly userId: User["id"],
	) {}
}

export class TaskCompletion {
	constructor(
		public readonly id: string,
		public readonly taskId: Task["id"],
		public readonly date: Date,
	) {}
}
