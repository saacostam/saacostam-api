import { UserUseCasesService } from "@/apps/hrm/app";
import { MongooseUserRepositoryImpl } from "../repositories";

export const userUseCasesService = new UserUseCasesService(
	new MongooseUserRepositoryImpl(),
);
