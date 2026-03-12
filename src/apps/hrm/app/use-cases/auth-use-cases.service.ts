import {
	InvalidLoginAttemptError,
	UserWithHash,
	UserWithUsernameAlreadyExistsError,
} from "@/apps/hrm/domain";
import { generateId } from "@/shared/utils";
import type {
	LoginRequestDto,
	LoginResponseDto,
	SignUpRequestDto,
	SignUpResponseDto,
} from "../dtos";
import type { JwtTokenService, PasswordHasher } from "../providers";
import type { UserRepository } from "../repositories";

export class AuthUseCasesService {
	constructor(
		private userRepository: UserRepository,
		private passwordHasher: PasswordHasher,
		private jwtTokenService: JwtTokenService,
	) {}

	async signUp({
		username,
		firstName,
		lastName,
		password,
		timezone,
	}: SignUpRequestDto): Promise<SignUpResponseDto> {
		const isUnique =
			(await this.userRepository.filterByUsername(username.value)).length === 0;

		if (!isUnique) {
			throw new UserWithUsernameAlreadyExistsError(
				username.value,
				username.fieldName,
			);
		}

		const hashedPassword = await this.passwordHasher.hash(password.value);

		const newUser = new UserWithHash(
			generateId(),
			username.value,
			firstName.value,
			lastName.value,
			hashedPassword,
			timezone.value,
		);

		const user = await this.userRepository.create(newUser);

		return {
			username: user.username,
		};
	}

	async logIn({
		username,
		password,
	}: LoginRequestDto): Promise<LoginResponseDto> {
		const existingUser =
			await this.userRepository.getUserWithHashByUsername(username);

		if (!existingUser) {
			throw new InvalidLoginAttemptError();
		}

		const isPasswordCorrect = await this.passwordHasher.compare(
			password,
			existingUser.passwordHash,
		);

		if (!isPasswordCorrect) {
			throw new InvalidLoginAttemptError();
		}

		const token = this.jwtTokenService.getToken({ userId: existingUser.id });

		return {
			token,
		};
	}
}
