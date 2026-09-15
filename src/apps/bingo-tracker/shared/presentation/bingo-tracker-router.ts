import { Router } from "express";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";

export const bingoTrackerRouter = Router();

bingoTrackerRouter.use(errorHandlerMiddleware);
