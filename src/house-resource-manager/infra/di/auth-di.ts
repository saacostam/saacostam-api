import { AuthUseCasesService } from "../../app/use-cases";
import { PasswordHasherImpl, InMemoryUserRepositoryImpl, JwtTokenServiceImpl } from "../repositories";

export const authUseCasesService = new AuthUseCasesService(
    new InMemoryUserRepositoryImpl(),
    new PasswordHasherImpl(),
    new JwtTokenServiceImpl(),
)
