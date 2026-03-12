import { Router } from "express";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";
import { eventRouter } from "./event-router";

const analyticsRouter = Router();

analyticsRouter.use("/event", eventRouter);

analyticsRouter.use(errorHandlerMiddleware);

export { analyticsRouter };
