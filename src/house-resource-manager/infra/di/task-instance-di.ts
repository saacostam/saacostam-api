import { TaskInstanceUseCases } from "../../app/use-cases";
import {
	MongooseTaskCompletionRepositoryImpl,
	MongooseTaskRepositoryImpl,
	MongooseUserRepositoryImpl,
} from "../repositories";

export const taskInstanceUseCasesService = new TaskInstanceUseCases(
	new MongooseTaskRepositoryImpl(),
	new MongooseTaskCompletionRepositoryImpl(),
	new MongooseUserRepositoryImpl(),
);
