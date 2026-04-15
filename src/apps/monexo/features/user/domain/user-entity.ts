export interface IUser {
	id: string;
	username: string;
}

export interface IUserWithHash extends IUser {
	passwordHash: string;
}
