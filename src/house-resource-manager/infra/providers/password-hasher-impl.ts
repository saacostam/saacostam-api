import { compare, hash } from "bcrypt";
import type { PasswordHasher } from "../../app/providers";

export class PasswordHasherImpl implements PasswordHasher {
	hash(password: string) {
		return hash(password, 10);
	}

	compare(plaintextPassword: string, passwordHash: string) {
		return compare(plaintextPassword, passwordHash);
	}
}
