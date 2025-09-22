import { TaskInstanceUseCases } from "../../app/use-cases";
import {
	MongooseResourceRepositoryImpl,
	MongooseTaskCompletionRepositoryImpl,
	MongooseTaskRepositoryImpl,
	MongooseUserRepositoryImpl,
} from "../repositories";

export const taskInstanceUseCasesService = new TaskInstanceUseCases(
	new MongooseTaskRepositoryImpl(),
	new MongooseTaskCompletionRepositoryImpl(),
	new MongooseUserRepositoryImpl(),
	new MongooseResourceRepositoryImpl(),
);
