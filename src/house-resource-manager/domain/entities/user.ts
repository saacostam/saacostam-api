import type { Timezone } from "../value-objects";

export class User {
	constructor(
		public readonly id: string,
		public readonly username: string,
		public readonly firstName: string,
		public readonly lastName: string,
		public readonly timezone: Timezone,
	) {}
}

export class UserWithHash extends User {
	constructor(
		public readonly id: string,
		public readonly username: string,
		public readonly firstName: string,
		public readonly lastName: string,
		public readonly passwordHash: string,
		public readonly timezone: Timezone,
	) {
		super(id, username, firstName, lastName, timezone);
	}
}
