import { generateId } from "../../../core.utils";
import { UserWithHash } from "../../domain/entities";
import { InvalidLoginAttemptError, UserWithUsernameAlreadyExistsError } from "../../domain/errors";
import { JwtTokenService, PasswordHasher, UserRepository } from "../../domain/repositories";
import { LoginRequestDto, LoginResponseDto, SignUpRequestDto, SignUpResponseDto } from "../dtos";

export class AuthUseCasesService {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher,
        private jwtTokenService: JwtTokenService,
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

    async logIn({
        username,
        password,
    }: LoginRequestDto): Promise<LoginResponseDto> {
        const existingUser = await this.userRepository.getUserWithHashByUsername(username);

        if (!existingUser) {
            throw new InvalidLoginAttemptError();
        }

        const isPasswordCorrect = await this.passwordHasher.compare(password, existingUser.passwordHash);

        if (!isPasswordCorrect) {
            throw new InvalidLoginAttemptError();
        }

        const token = this.jwtTokenService.getToken({ userId: existingUser.id });

        return {
            token,
        }
    }
}
