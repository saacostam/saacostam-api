import { DomainErrorType } from "../../domain/errors";

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
  errors?: FieldError[];
}

export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
}

export const mapDomainErrorTypeToStatusCode: Record<DomainErrorType, number> = {
  [DomainErrorType.BAD_REQUEST]: 400,
  [DomainErrorType.NOT_FOUND]: 404,
  [DomainErrorType.UNAUTHORIZED]: 401,
} 
