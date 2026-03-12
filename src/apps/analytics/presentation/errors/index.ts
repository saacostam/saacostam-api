import { DomainErrorType } from "@/apps/analytics/domain";

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
	[DomainErrorType.SERVER_ERROR]: 500,
};

export const mapDomainErrorTypeToGenericError: Record<DomainErrorType, string> =
	{
		[DomainErrorType.BAD_REQUEST]: "Invalid request",
		[DomainErrorType.SERVER_ERROR]: "Something went wrong",
	};
