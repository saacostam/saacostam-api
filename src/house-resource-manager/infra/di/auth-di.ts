import { AuthUseCasesService } from "../../app/use-cases";
import { PasswordHasherImpl, JwtTokenServiceImpl } from "../providers";
import { InMemoryUserRepositoryImpl } from "../repositories";

export const authUseCasesService = new AuthUseCasesService(
    new InMemoryUserRepositoryImpl(),
    new PasswordHasherImpl(),
    new JwtTokenServiceImpl(),
)
