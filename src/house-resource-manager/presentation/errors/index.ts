export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends Error {
  public status: number;
  public errors: FieldError[];

  constructor(errors: FieldError[], message: string = "Validation failed", status: number = 400) {
    super(message);
    this.name = 'ValidationError';
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
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
