export interface PasswordHasher {
	hash(password: string): Promise<string>;

	compare(plaintextPassword: string, passwordHash: string): Promise<boolean>;
}
