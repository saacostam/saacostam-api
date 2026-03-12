import { BaseDomainError, DomainErrorType } from "./base.error";

export class UserWithUsernameAlreadyExistsError extends BaseDomainError {
	constructor(username: string, fieldName?: string) {
		super(
			DomainErrorType.BAD_REQUEST,
			`A user with the username '${username}' already exists.`,
			[
				{
					field: fieldName ?? "username",
					message: `A user with the username '${username}' already exists.`,
				},
			],
		);

		this.name = "UserWithUsernameAlreadyExistsError";

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UserWithUsernameAlreadyExistsError);
		}
	}
}

export class InvalidLoginAttemptError extends BaseDomainError {
	constructor() {
		super(DomainErrorType.BAD_REQUEST, "Invalid Login Credentials");

		this.name = "InvalidLoginAttemptError";

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UserWithUsernameAlreadyExistsError);
		}
	}
}
