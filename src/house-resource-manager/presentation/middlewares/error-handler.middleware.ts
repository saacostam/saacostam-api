import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { FieldError, ValidationError } from '../errors';
import { UserWithUsernameAlreadyExistsError } from '../../domain/errors';

export function errorHandlerMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: FieldError[] | undefined = undefined;

  if (err instanceof ZodError) {
    statusCode = 400; // Bad Request for validation errors
    message = "Invalid request data";

    const fieldSpecificErrors: FieldError[] = [];
    const rootValidationMessages: string[] = [];

    err.errors.forEach((zodErr) => {
      if (zodErr.path.length > 0) {
        fieldSpecificErrors.push({
          field: zodErr.path.join('.'),
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
      message = `${message}: ${rootValidationMessages.join(', ')}`;
    }
  } else if (err instanceof UserWithUsernameAlreadyExistsError) {
    statusCode = 400;
    message = err.message;
    errors = [
      {
        field: "username",
        message: err.message,
      }
    ]
  } else if (err instanceof ValidationError) {
    statusCode = err.status;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof Error) {
    if (typeof (err as any).status === 'number') {
      statusCode = (err as any).status;
    }
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(errors && { errors }),
  });
}