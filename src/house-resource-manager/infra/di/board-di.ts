import { BoardUseCasesService } from "../../app/use-cases";
import { HtmlSanitizationServiceImpl } from "../providers";
import { MongooseBoardRepositoryImpl } from "../repositories";

export const boardUseCasesService = new BoardUseCasesService(
	new MongooseBoardRepositoryImpl(),
	new HtmlSanitizationServiceImpl(),
);
