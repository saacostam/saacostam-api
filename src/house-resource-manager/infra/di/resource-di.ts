import { ResourceUseCasesService } from "../../app/use-cases";
import {
	MongooseCategoryRepositoryImpl,
	MongooseResourceRepositoryImpl,
} from "../repositories";

export const resourceUseCasesService = new ResourceUseCasesService(
	new MongooseResourceRepositoryImpl(),
	new MongooseCategoryRepositoryImpl(),
);
