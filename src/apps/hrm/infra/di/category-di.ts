import { CategoryUseCasesService } from "@/apps/hrm/app";
import { MongooseCategoryRepositoryImpl } from "../repositories";

export const categoryUseCasesService = new CategoryUseCasesService(
	new MongooseCategoryRepositoryImpl(),
);
