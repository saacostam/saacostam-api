import { BaseDomainError, DomainErrorType } from "@/apps/hrm/domain";

export interface FieldError {
	field: string;
	message: string;
}

export interface ErrorResponse {
	message: string;
	status: number;
	errors?: FieldError[];
}

export class UnauthorizedError extends BaseDomainError {
	public statusCode: number;

	constructor() {
		super(DomainErrorType.UNAUTHORIZED, "Unauthorized");
		this.name = "UnauthorizedError";
		this.statusCode = 401;

		// Maintains proper stack trace
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UnauthorizedError);
		}
	}
}

export const mapDomainErrorTypeToStatusCode: Record<DomainErrorType, number> = {
	[DomainErrorType.BAD_REQUEST]: 400,
	[DomainErrorType.UNAUTHORIZED]: 401,
	[DomainErrorType.NOT_FOUND]: 404,
	[DomainErrorType.SERVER_ERROR]: 500,
};

export const ID_FIELD_NOT_FOUND_ERROR = new BaseDomainError(
	DomainErrorType.BAD_REQUEST,
	"Id field is required",
	[
		{
			field: "id",
			message: "REQUIRED",
		},
	],
);
