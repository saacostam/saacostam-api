import { TaskInstanceUseCases } from "../../app/use-cases";
import {
	InMemoryTaskCompletionRepositoryImpl,
	InMemoryTaskRepositoryImpl,
	InMemoryUserRepositoryImpl,
} from "../repositories";

export const taskInstanceUseCasesService = new TaskInstanceUseCases(
	new InMemoryTaskRepositoryImpl(),
	new InMemoryTaskCompletionRepositoryImpl(),
	new InMemoryUserRepositoryImpl(),
);
