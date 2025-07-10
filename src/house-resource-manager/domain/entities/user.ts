export class User {
	constructor(
		public readonly id: string,
		public readonly username: string,
		public readonly firstName: string,
		public readonly lastName: string,
	) {}
}

export class UserWithHash extends User {
	constructor(
		public readonly id: string,
		public readonly username: string,
		public readonly firstName: string,
		public readonly lastName: string,
		public readonly passwordHash: string,
	) {
		super(id, username, firstName, lastName);
	}
}
