import { compare, hash } from "bcrypt";
import type { IPasswordHasherAdapter } from "@/apps/monexo/shared/providers/domain";

export class PasswordHasherImpl implements IPasswordHasherAdapter {
	hash(password: string) {
		return hash(password, 10);
	}

	compare(plaintextPassword: string, passwordHash: string) {
		return compare(plaintextPassword, passwordHash);
	}
}
