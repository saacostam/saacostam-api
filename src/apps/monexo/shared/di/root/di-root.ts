import { AuthUseCases } from "@/apps/monexo/features/auth/app";
import { CategoryUseCases } from "@/apps/monexo/features/category/app";
import { InMemoryCategoryRepository } from "@/apps/monexo/features/category/infra";
import { UserUseCases } from "@/apps/monexo/features/user/app";
import { InMemoryUserRepository } from "@/apps/monexo/features/user/infra";
import type { IContext } from "@/apps/monexo/shared/di/app";
import { createWithAuth } from "@/apps/monexo/shared/middleware";
import {
	JwtTokenAdapterImpl,
	PasswordHasherImpl,
	UuidIdGeneratorAdapter,
} from "@/apps/monexo/shared/providers/infra";

const inMemoryCategoryRepository = new InMemoryCategoryRepository();
const inMemoryUserRepository = new InMemoryUserRepository();

const jwtTokenAdapter = new JwtTokenAdapterImpl();
const passwordHasherAdapter = new PasswordHasherImpl();
const uuidGenIdAdapter = new UuidIdGeneratorAdapter();

const ctx: IContext = {
	repo: {
		category: inMemoryCategoryRepository,
		user: inMemoryUserRepository,
	},
	prov: {
		genId: uuidGenIdAdapter,
		jwt: jwtTokenAdapter,
		pwHasher: passwordHasherAdapter,
	},
};

export const authUseCases = new AuthUseCases(ctx);
export const categoryUseCases = new CategoryUseCases(ctx);
export const userUseCases = new UserUseCases(ctx);

export const withAuth = createWithAuth(jwtTokenAdapter);
