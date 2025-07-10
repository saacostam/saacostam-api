import type { GetUserRequestDto } from "../dtos";
import type { UserRepository } from "../repositories";

export class UserUseCasesService {
	constructor(private userRepository: UserRepository) {}

	getMe({ id }: GetUserRequestDto) {
		return this.userRepository.getById(id);
	}
}
