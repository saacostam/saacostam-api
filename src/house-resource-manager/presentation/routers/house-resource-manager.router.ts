import { Router } from "express";
import { authMiddleware, errorHandlerMiddleware } from "../middlewares";
import { authRouter } from "./auth.router";
import { categoryRouter } from "./category.router";
import { resourceRouter } from "./resource.router";
import { taskRouter } from "./task.router";
import { taskInstanceRouter } from "./task-instance.router";
import { userRouter } from "./user.router";

const houseResourceManager = Router();

houseResourceManager.use("/auth", authRouter);
houseResourceManager.use(authMiddleware);

houseResourceManager.use("/category", categoryRouter);
houseResourceManager.use("/resource", resourceRouter);
houseResourceManager.use("/task", taskRouter);
houseResourceManager.use("/i/task", taskInstanceRouter);
houseResourceManager.use("/user", userRouter);

houseResourceManager.use(errorHandlerMiddleware);

export { houseResourceManager };
