import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import {
	type ErrorResponse,
	type FieldError,
	mapDomainErrorTypeToGenericError,
	mapDomainErrorTypeToStatusCode,
} from "./errors";

export function errorHandlerMiddleware(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	console.error(JSON.stringify(err));

	let statusCode = 500;
	let message = mapDomainErrorTypeToGenericError[DomainErrorType.SERVER_ERROR];
	let errors: FieldError[] | undefined;

	if (err instanceof ZodError) {
		statusCode = 400; // Bad Request for purely syntactical validation errors
		message = mapDomainErrorTypeToGenericError[DomainErrorType.BAD_REQUEST];

		const fieldSpecificErrors: FieldError[] = [];
		const rootValidationMessages: string[] = [];

		err.errors.forEach((zodErr) => {
			if (zodErr.path.length > 0) {
				fieldSpecificErrors.push({
					field: zodErr.path.join("."),
					message: zodErr.message,
				});
			} else {
				rootValidationMessages.push(zodErr.message);
			}
		});

		if (fieldSpecificErrors.length > 0) {
			errors = fieldSpecificErrors;
		}

		if (rootValidationMessages.length > 0) {
			message = `${message}: ${rootValidationMessages.join(", ")}`;
		}
	} else if (err instanceof BaseDomainError) {
		statusCode = mapDomainErrorTypeToStatusCode[err.type];
		message =
			err.userMessage ||
			mapDomainErrorTypeToGenericError[err.type] ||
			mapDomainErrorTypeToGenericError[DomainErrorType.SERVER_ERROR];
		errors = err.errors;
	} else if (err instanceof Error) {
		const errorWithStatus = err as unknown as { status: unknown };

		if (typeof errorWithStatus.status === "number") {
			statusCode = errorWithStatus.status;
		}
		message = err.message;
	}

	const errorResponse: ErrorResponse = {
		message: message,
		status: statusCode,
		errors: errors,
	};

	res.status(statusCode).json(errorResponse);
}
