import { AuthUseCasesService } from "../../app/use-cases";
import { PasswordHasherImpl, InMemoryUserRepositoryImpl } from "../repositories";

export const authUseCasesService = new AuthUseCasesService(
    new InMemoryUserRepositoryImpl(),
    new PasswordHasherImpl(),
)
