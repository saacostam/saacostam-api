import { GetUserRequestDto } from "../dtos";
import { UserRepository } from "../repositories";

export class UserUseCasesService {
    constructor(
        private userRepository: UserRepository,
    ) {}

    getMe({
        id,
    }: GetUserRequestDto) {
        return this.userRepository.getById(id);
    }
}
