import { BoardUseCasesService } from "../../app/use-cases";
import { MongooseBoardRepositoryImpl } from "../repositories";

export const boardUseCasesService = new BoardUseCasesService(
	new MongooseBoardRepositoryImpl(),
);
