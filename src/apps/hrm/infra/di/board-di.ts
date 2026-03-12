import { BoardUseCasesService } from "@/apps/hrm/app";
import { HtmlSanitizationServiceImpl } from "../providers";
import { MongooseBoardRepositoryImpl } from "../repositories";

export const boardUseCasesService = new BoardUseCasesService(
	new MongooseBoardRepositoryImpl(),
	new HtmlSanitizationServiceImpl(),
);
