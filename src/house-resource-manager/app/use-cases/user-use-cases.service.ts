import { UserRepository } from "../../domain/repositories";
import { GetUserRequestDto } from "../dtos";

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
