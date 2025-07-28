import { ResourceUseCasesService } from "../../app/use-cases";
import { InMemoryResourceRepositoryImpl } from "../repositories";

export const resourceUseCasesService = new ResourceUseCasesService(
	new InMemoryResourceRepositoryImpl(),
);
