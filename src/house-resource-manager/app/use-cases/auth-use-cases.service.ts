import { generateId } from "@/core.utils";
import { UserWithHash } from "../../domain/entities";
import { UserWithUsernameAlreadyExistsError } from "../../domain/errors";
import { PasswordHasher, UserRepository } from "../../domain/repositories";
import { SignUpRequestDto, SignUpResponseDto } from "../dtos";

export class AuthUseCasesService {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher,
    ){}

    async signUp({
        username,
        firstName,
        lastName,
        password,
    }: SignUpRequestDto): Promise<SignUpResponseDto> {
        const isUnique = (await this.userRepository.filterByUsername(username)).length === 0;

        if (!isUnique) {
            throw new UserWithUsernameAlreadyExistsError(username);
        }

        const hashedPassword = await this.passwordHasher.hash(password);

        const newUser = new UserWithHash(
            generateId(),
            username,
            firstName,
            lastName,
            hashedPassword,
        );

        const user = await this.userRepository.create(newUser)

        return {
            username: user.username,
        }
    }
}
