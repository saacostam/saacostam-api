import { UserUseCasesService } from "../../app/use-cases";
import { MongooseUserRepositoryImpl } from "../repositories";

export const userUseCasesService = new UserUseCasesService(
	new MongooseUserRepositoryImpl(),
);
