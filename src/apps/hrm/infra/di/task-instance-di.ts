import { TaskInstanceUseCases } from "@/apps/hrm/app";
import {
	MongooseCategoryRepositoryImpl,
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
	new MongooseCategoryRepositoryImpl(),
);
