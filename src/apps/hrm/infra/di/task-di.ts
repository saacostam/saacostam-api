import { TaskUseCasesService } from "@/apps/hrm/app";
import {
	MongooseCategoryRepositoryImpl,
	MongooseResourceRepositoryImpl,
	MongooseTaskRepositoryImpl,
} from "../repositories";

export const taskUseCasesService = new TaskUseCasesService(
	new MongooseCategoryRepositoryImpl(),
	new MongooseResourceRepositoryImpl(),
	new MongooseTaskRepositoryImpl(),
);
