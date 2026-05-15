import { AuthUseCases } from "@/apps/monexo/features/auth/app";
import { CategoryUseCases } from "@/apps/monexo/features/category/app";
import { MongoCategoryRepository } from "@/apps/monexo/features/category/infra";
import { ExpenseUseCases } from "@/apps/monexo/features/expense/app";
import { InMemoryExpenseRepository } from "@/apps/monexo/features/expense/infra";
import { UserUseCases } from "@/apps/monexo/features/user/app";
import { MongoUserRepository } from "@/apps/monexo/features/user/infra";
import type { IContext } from "@/apps/monexo/shared/di/app";
import { createWithAuth } from "@/apps/monexo/shared/middleware";
import {
	ErrorLoggerProviderImpl,
	JwtTokenAdapterImpl,
	PasswordHasherImpl,
	UuidIdGeneratorAdapter,
} from "@/apps/monexo/shared/providers/infra";

const mongoCategoryRepository = new MongoCategoryRepository();
const inMemoryExpenseRepository = new InMemoryExpenseRepository();
const mongoUserRepository = new MongoUserRepository();

const errorLogger = new ErrorLoggerProviderImpl();
const jwtTokenAdapter = new JwtTokenAdapterImpl();
const passwordHasherAdapter = new PasswordHasherImpl();
const uuidGenIdAdapter = new UuidIdGeneratorAdapter();

const ctx: IContext = {
	repo: {
		category: mongoCategoryRepository,
		expense: inMemoryExpenseRepository,
		user: mongoUserRepository,
	},
	prov: {
		errorLogger: errorLogger,
		genId: uuidGenIdAdapter,
		jwt: jwtTokenAdapter,
		pwHasher: passwordHasherAdapter,
	},
};

export const authUseCases = new AuthUseCases(ctx);
export const categoryUseCases = new CategoryUseCases(ctx);
export const expenseUseCases = new ExpenseUseCases(ctx);
export const userUseCases = new UserUseCases(ctx);

export const withAuth = createWithAuth(jwtTokenAdapter);
