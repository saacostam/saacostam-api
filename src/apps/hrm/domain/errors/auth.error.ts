import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class UserWithUsernameAlreadyExistsError extends BaseDomainError {
	constructor(username: string, fieldName?: string) {
		super(
			{
				type: DomainErrorType.BAD_REQUEST,
				userMessage: `A user with the username '${username}' already exists.`,
				message: `[UserWithUsernameAlreadyExistsError] username: '${username}'`,
			},
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
		super({
			type: DomainErrorType.BAD_REQUEST,
			userMessage: "Invalid Login Credentials",
			message: "[InvalidLoginAttemptError]",
		});

		this.name = "InvalidLoginAttemptError";

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UserWithUsernameAlreadyExistsError);
		}
	}
}
