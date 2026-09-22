import { Router } from "express";
import { authRouter } from "@/apps/bingo-tracker/features/auth/presentation";
import { boardRouter } from "@/apps/bingo-tracker/features/board/presentation";
import { gameRouter } from "@/apps/bingo-tracker/features/game/presentation";
import { playRouter } from "@/apps/bingo-tracker/features/play/presentation";
import { userRouter } from "@/apps/bingo-tracker/features/user/presentation";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";

export const bingoTrackerRouter = Router();

bingoTrackerRouter.use("/auth", authRouter);
bingoTrackerRouter.use("/board", boardRouter);
bingoTrackerRouter.use("/game", gameRouter);
bingoTrackerRouter.use("/play", playRouter);
bingoTrackerRouter.use("/user", userRouter);

bingoTrackerRouter.use(errorHandlerMiddleware);
