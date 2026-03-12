import type { Category } from "./category";
import type { User } from "./user";

export class Resource {
	constructor(
		public readonly id: string,
		public name: string,
		public description: string | null,
		public status: "active" | "archived",
		public readonly creationDate: Date,
		public updateDate: Date,
		public categoryId: Category["id"] | null,
		public quantity: number,
		public readonly userId: User["id"],
	) {}
}
