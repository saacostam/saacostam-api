import { AuthUseCases } from "@/apps/monexo/features/auth/app";
import { UserUseCases } from "@/apps/monexo/features/user/app";
import { InMemoryUserRepository } from "@/apps/monexo/features/user/infra";
import type { IContext } from "@/apps/monexo/shared/di/app";
import {
	JwtTokenAdapterImpl,
	PasswordHasherImpl,
	UuidIdGeneratorAdapter,
} from "@/apps/monexo/shared/providers/infra";

const inMemoryUserRepository = new InMemoryUserRepository();

const jwtTokenAdapter = new JwtTokenAdapterImpl();
const passwordHasherAdapter = new PasswordHasherImpl();
const uuidGenIdAdapter = new UuidIdGeneratorAdapter();

const ctx: IContext = {
	repo: {
		user: inMemoryUserRepository,
	},
	prov: {
		genId: uuidGenIdAdapter,
		jwt: jwtTokenAdapter,
		pwHasher: passwordHasherAdapter,
	},
};

export const authUseCases = new AuthUseCases(ctx);
export const userUseCases = new UserUseCases(ctx);
