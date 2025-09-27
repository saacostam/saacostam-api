import { BoardUseCasesService } from "../../app/use-cases";
import { InMemoryBoardRepositoryImpl } from "../repositories";

export const boardUseCasesService = new BoardUseCasesService(
	new InMemoryBoardRepositoryImpl(),
);
