import { CategoryUseCasesService } from "../../app/use-cases";
import { MongooseCategoryRepositoryImpl } from "../repositories";

export const categoryUseCasesService = new CategoryUseCasesService(
	new MongooseCategoryRepositoryImpl(),
);
