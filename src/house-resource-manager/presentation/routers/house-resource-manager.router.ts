import { Router } from "express";

import { authRouter } from "./auth.router";
import { categoryRouter } from "./category.router";
import { userRouter } from "./user.router";

import { authMiddleware, errorHandlerMiddleware } from "../middlewares";

const houseResourceManager = Router();

houseResourceManager.use(authMiddleware);

houseResourceManager.use("/auth", authRouter);
houseResourceManager.use("/category", categoryRouter);
houseResourceManager.use("/user", userRouter);

houseResourceManager.use(errorHandlerMiddleware);

export {
    houseResourceManager,
}
