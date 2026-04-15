import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

class ErrorFactory {
	userByIdNotFound(args: {
		id: string;
		append?: string;
		ctx: string;
	}): BaseDomainError {
		return new BaseDomainError({
			type: DomainErrorType.NOT_FOUND,
			userMessage: "User not found",
			message: `[${args.ctx}] User with id ${args.id} was not found${args.append ? ` - ${args.append}` : ""}`,
		});
	}
}

export const errorFactory = new ErrorFactory();
