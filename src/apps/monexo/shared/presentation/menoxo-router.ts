import { Router } from "express";
import { authRouter } from "@/apps/monexo/features/auth/presentation";
import { userRouter } from "@/apps/monexo/features/user/presentation";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";

export const monexoRouter = Router();

monexoRouter.use("/auth", authRouter);
monexoRouter.use("/user", userRouter);

monexoRouter.use(errorHandlerMiddleware);
