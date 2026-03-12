import { ResourceUseCasesService } from "@/apps/hrm/app";
import {
	MongooseCategoryRepositoryImpl,
	MongooseResourceRepositoryImpl,
} from "../repositories";

export const resourceUseCasesService = new ResourceUseCasesService(
	new MongooseResourceRepositoryImpl(),
	new MongooseCategoryRepositoryImpl(),
);
