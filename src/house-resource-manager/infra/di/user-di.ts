import { UserUseCasesService } from "../../app/use-cases";
import { InMemoryUserRepositoryImpl } from "../repositories";

export const userUseCasesService = new UserUseCasesService(
	new InMemoryUserRepositoryImpl(),
);
