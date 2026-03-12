import { AuthUseCasesService } from "@/apps/hrm/app";
import { JwtTokenServiceImpl, PasswordHasherImpl } from "../providers";
import { MongooseUserRepositoryImpl } from "../repositories";

export const authUseCasesService = new AuthUseCasesService(
	new MongooseUserRepositoryImpl(),
	new PasswordHasherImpl(),
	new JwtTokenServiceImpl(),
);
