import { DomainErrorType } from "@/shared/errors/domain";

export interface FieldError {
	field: string;
	message: string;
}

export interface ErrorResponse {
	message: string;
	status: number;
	errors?: FieldError[];
}

export const mapDomainErrorTypeToStatusCode: Record<DomainErrorType, number> = {
	[DomainErrorType.BAD_REQUEST]: 400,
	[DomainErrorType.CONFLICT]: 409,
	[DomainErrorType.UNAUTHORIZED]: 401,
	[DomainErrorType.NOT_FOUND]: 404,
	[DomainErrorType.SERVER_ERROR]: 500,
};

export const mapDomainErrorTypeToGenericError: Record<DomainErrorType, string> =
	{
		[DomainErrorType.BAD_REQUEST]: "Invalid request",
		[DomainErrorType.CONFLICT]: "Conflict",
		[DomainErrorType.UNAUTHORIZED]: "Unauthorized",
		[DomainErrorType.NOT_FOUND]: "Not found",
		[DomainErrorType.SERVER_ERROR]: "Something went wrong",
	};
