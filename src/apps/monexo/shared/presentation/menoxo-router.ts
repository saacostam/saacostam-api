import { Router } from "express";
import { authRouter } from "@/apps/monexo/features/auth/presentation";
import { categoryRouter } from "@/apps/monexo/features/category/presentation";
import { expenseRouter } from "@/apps/monexo/features/expense/presentation";
import { userRouter } from "@/apps/monexo/features/user/presentation";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";

export const monexoRouter = Router();

monexoRouter.use("/auth", authRouter);
monexoRouter.use("/category", categoryRouter);
monexoRouter.use("/expense", expenseRouter);
monexoRouter.use("/user", userRouter);

monexoRouter.use(errorHandlerMiddleware);
