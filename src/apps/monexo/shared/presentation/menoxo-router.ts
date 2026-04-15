import { Router } from "express";
import { userRouter } from "@/apps/monexo/features/user/presentation";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";

export const monexoRouter = Router();

monexoRouter.use("/user", userRouter);

monexoRouter.use(errorHandlerMiddleware);
