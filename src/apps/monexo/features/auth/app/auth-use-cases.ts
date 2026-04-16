import type { IUserWithHash } from "@/apps/monexo/features/user/domain";
import type { IContext } from "@/apps/monexo/shared/di/app";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export class AuthUseCases {
	constructor(private ctx: IContext) {}

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

		const passwordHash = await this.ctx.prov.pwHasher.hash(password.value);

		const newUser: IUserWithHash = {
			id: this.ctx.prov.genId.gen(),
			username: username.value,
			passwordHash: passwordHash,
		};

		await this.ctx.repo.user.create(newUser);
	}
}
