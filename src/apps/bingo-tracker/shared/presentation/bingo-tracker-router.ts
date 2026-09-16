import { Router } from "express";
import { authRouter } from "@/apps/bingo-tracker/features/auth/presentation";
import { userRouter } from "@/apps/bingo-tracker/features/user/presentation";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";

export const bingoTrackerRouter = Router();

bingoTrackerRouter.use("/auth", authRouter);
bingoTrackerRouter.use("/user", userRouter);

bingoTrackerRouter.use(errorHandlerMiddleware);
