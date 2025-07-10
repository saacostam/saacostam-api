export enum DomainErrorType {
	BAD_REQUEST = "Bad Request",
	NOT_FOUND = "Not Found",
	UNAUTHORIZED = "Unauthorized",
}

export interface FieldError {
	field: string;
	message: string;
}

export class BaseDomainError extends Error {
	public type: DomainErrorType;
	public errors: FieldError[];

	constructor(type: DomainErrorType, message: string, errors?: FieldError[]) {
		super(message);

		this.name = "Domain Error";
		this.type = type;
		this.errors = errors || [];

		Object.setPrototypeOf(this, BaseDomainError.prototype);
	}
}
