import type { UserWithPwHash } from "@/apps/bingo-tracker/features/user/domain";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class AuthUseCases {
	constructor(private ctx: Context) {}

	async login(username: string, password: string): Promise<{ token: string }> {
		const existingUser =
			await this.ctx.repo.user.getUserWithHashByUsername(username);

		if (!existingUser) {
			throw this.createInvalidCredError(
				`User with username ${username} not found`,
			);
		}

		const isPasswordCorrect = await this.ctx.adapter.pwHasher.compare(
			password,
			existingUser.passwordHash,
		);

		if (!isPasswordCorrect) {
			throw this.createInvalidCredError("Incorrect password");
		}

		const token = this.ctx.adapter.token.getToken({ userId: existingUser.id });

		return {
			token,
		};
	}

	async signUp(
		username: {
			field: string;
			value: string;
		},
		password: {
			field: string;
			value: string;
		},
	) {
		const userWithSameUsername = await this.ctx.repo.user.filterByUsername(
			username.value,
		);
		const isUnique = userWithSameUsername.length === 0;

		if (!isUnique) {
			throw new BaseDomainError(
				{
					type: DomainErrorType.CONFLICT,
					message: `[AuthUseCases.signUp] Username ${username.value} it not unique`,
					userMessage: "Username already in use",
				},
				[
					{
						field: username.field,
						message: "Username already in use",
					},
				],
			);
		}

		const passwordHash = await this.ctx.adapter.pwHasher.hash(password.value);

		const newUser: UserWithPwHash = {
			id: this.ctx.adapter.idGen.gen(),
			username: username.value,
			passwordHash: passwordHash,
		};

		await this.ctx.repo.user.create(newUser);
	}

	private createInvalidCredError(ctx: string): BaseDomainError {
		return new BaseDomainError({
			type: DomainErrorType.BAD_REQUEST,
			userMessage: "Invalid login credentials",
			message: `[AuthUseCases.login] ${ctx}`,
		});
	}
}
