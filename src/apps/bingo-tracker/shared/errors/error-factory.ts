import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

class ErrorFactory {
	boardByIdNotFound(args: {
		id: string;
		append?: string;
		ctx: string;
	}): BaseDomainError {
		return new BaseDomainError({
			type: DomainErrorType.NOT_FOUND,
			userMessage: "Board not found",
			message: `[${args.ctx}] Board with id ${args.id} was not found${args.append ? ` - ${args.append}` : ""}`,
		});
	}

	fieldMissing(args: {
		ctx: string;
		field: {
			detailedName: string;
			name: string;
		};
	}): BaseDomainError {
		return new BaseDomainError(
			{
				type: DomainErrorType.BAD_REQUEST,
				message: `[${args.ctx}] Field with name ${args.field.detailedName} was missing`,
				userMessage: `${args.field.detailedName} is required but was not provided`,
			},
			[
				{
					field: args.field.name,
					message: "Required",
				},
			],
		);
	}

	gameByIdNotFound(args: {
		id: string;
		append?: string;
		ctx: string;
	}): BaseDomainError {
		return new BaseDomainError({
			type: DomainErrorType.NOT_FOUND,
			userMessage: "Game not found",
			message: `[${args.ctx}] Game with id ${args.id} was not found${args.append ? ` - ${args.append}` : ""}`,
		});
	}

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
