import { TaskUseCasesService } from "../../app/use-cases";
import {
	MongooseCategoryRepositoryImpl,
	MongooseResourceRepositoryImpl,
	MongooseTaskRepositoryImpl,
	MongooseUserRepositoryImpl,
} from "../repositories";

export const taskUseCasesService = new TaskUseCasesService(
	new MongooseCategoryRepositoryImpl(),
	new MongooseResourceRepositoryImpl(),
	new MongooseTaskRepositoryImpl(),
	new MongooseUserRepositoryImpl(),
);
