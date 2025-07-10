import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BaseDomainError } from "../../domain/errors";
import {
	type ErrorResponse,
	type FieldError,
	mapDomainErrorTypeToStatusCode,
} from "../errors";

export function errorHandlerMiddleware(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	console.error(err);

	let statusCode = 500;
	let message = "Internal Server Error";
	let errors: FieldError[] | undefined;

	if (err instanceof ZodError) {
		statusCode = 400; // Bad Request for validation errors
		message = "Invalid request data";

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
		message = err.message;
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
