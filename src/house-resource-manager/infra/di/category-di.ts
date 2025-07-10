import { CategoryUseCasesService } from "../../app/use-cases";
import { InMemoryCategoryRepositoryImpl } from "../repositories";

export const categoryUseCasesService = new CategoryUseCasesService(
	new InMemoryCategoryRepositoryImpl(),
);
