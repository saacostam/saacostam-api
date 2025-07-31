import { TaskUseCasesService } from "../../app/use-cases";
import {
	InMemoryCategoryRepositoryImpl,
	InMemoryResourceRepositoryImpl,
	InMemoryTaskRepositoryImpl,
} from "../repositories";

export const taskUseCasesService = new TaskUseCasesService(
	new InMemoryCategoryRepositoryImpl(),
	new InMemoryResourceRepositoryImpl(),
	new InMemoryTaskRepositoryImpl(),
);
