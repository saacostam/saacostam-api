export interface IPasswordHasherAdapter {
	hash(password: string): Promise<string>;
	compare(plaintextPassword: string, passwordHash: string): Promise<boolean>;
}
