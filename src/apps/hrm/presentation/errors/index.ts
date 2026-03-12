import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class UnauthorizedError extends BaseDomainError {
	public statusCode: number;

	constructor() {
		super({
			type: DomainErrorType.UNAUTHORIZED,
			userMessage: "Unauthorized",
			message: "Authentication required.",
		});
		this.name = "UnauthorizedError";
		this.statusCode = 401;

		// Maintains proper stack trace
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UnauthorizedError);
		}
	}
}

export const ID_FIELD_NOT_FOUND_ERROR = new BaseDomainError(
	{
		type: DomainErrorType.BAD_REQUEST,
		userMessage: "Id field is required",
		message: "[ID_FIELD_NOT_FOUND_ERROR]",
	},
	[
		{
			field: "id",
			message: "REQUIRED",
		},
	],
);
