import { ResourceUseCasesService } from "../../app/use-cases";
import {
	InMemoryCategoryRepositoryImpl,
	InMemoryResourceRepositoryImpl,
} from "../repositories";

export const resourceUseCasesService = new ResourceUseCasesService(
	new InMemoryResourceRepositoryImpl(),
	new InMemoryCategoryRepositoryImpl(),
);
