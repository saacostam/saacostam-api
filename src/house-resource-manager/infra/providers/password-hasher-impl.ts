import { hash, compare } from "bcrypt";
import { PasswordHasher } from "../../app/providers";

export class PasswordHasherImpl implements PasswordHasher {
    hash(password: string) {
        return hash(password, 10);
    }

    compare(plaintextPassword: string, passwordHash: string) {
        return compare(plaintextPassword, passwordHash);
    }
}
