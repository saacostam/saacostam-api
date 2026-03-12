import type { Category } from "./category";
import type { Resource } from "./resource";
import type { User } from "./user";

export class Task {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly description: string | null,
		public readonly resourcesIds: Resource["id"][] | null,
		public readonly categoryId: Category["id"] | null,
		public readonly cadence: Cadence,
		public readonly userId: User["id"],
		public readonly anchorDate: string,
	) {}
}

export type Cadence =
	| {
			type: "one-time";
	  }
	| {
			type: "daily";
	  }
	| {
			type: "weekly";
			dayOfTheWeek: number;
	  }
	| {
			type: "monthly-by-day";
			dayOfTheMonth: number;
	  }
	| {
			type: "monthly-by-weekday";
			weekOfTheMonth: number;
			dayOfTheWeek: number;
	  }
	| {
			type: "yearly-by-day";
	  }
	| {
			type: "time-based-recurrence";
			timeFrame: "day" | "week" | "month";
			amount: number;
	  };

export class TaskCompletion {
	constructor(
		public readonly id: string,
		public readonly taskId: Task["id"],
		public readonly date: string,
		public readonly userId: User["id"],
	) {}
}
