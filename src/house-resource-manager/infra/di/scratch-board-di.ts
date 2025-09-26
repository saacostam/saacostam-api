import { ScratchBoardUseCasesService } from "../../app/use-cases";
import { InMemoryScratchBoardRepositoryImpl } from "../repositories";

export const scratchBoardUseCasesService = new ScratchBoardUseCasesService(
	new InMemoryScratchBoardRepositoryImpl(),
);
