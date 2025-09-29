import { User } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import {
	type GetUserRequestDto,
	MutationUpdateSettingOutDto,
	type MutationUpdateSettingsInDto,
} from "../dtos";
import type { UserRepository } from "../repositories";

export class UserUseCasesService {
	constructor(private userRepository: UserRepository) {}

	getMe({ id }: GetUserRequestDto) {
		return this._getUser(id);
	}

	async updateSettings({
		timezone,
		userId,
	}: MutationUpdateSettingsInDto): Promise<MutationUpdateSettingOutDto> {
		const user = await this._getUser(userId);
		const updatedUser = new User(
			user.id,
			user.username,
			user.firstName,
			user.lastName,
			timezone,
		);
		await this.userRepository.updateById(user.id, updatedUser);

		return new MutationUpdateSettingOutDto({ ok: true });
	}

	async _getUser(userId: string): Promise<User> {
		const user = await this.userRepository.getById(userId);

		if (!user)
			throw new BaseDomainError(DomainErrorType.NOT_FOUND, "User not found");

		return user;
	}
}
