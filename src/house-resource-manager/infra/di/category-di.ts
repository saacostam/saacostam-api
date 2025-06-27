import { CategoryUseCasesService } from "../../app/use-cases";
import { CategoryRepositoryImplInMemory } from "../repositories";

export const categoryUseCasesService = new CategoryUseCasesService(
    new CategoryRepositoryImplInMemory(),
)
