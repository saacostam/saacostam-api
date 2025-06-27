import { Router } from "express";

import { categoryRouter } from "./category.router";
import { userRouter } from "./user.router";

import { authMiddleware } from "../middlewares";

const houseResourceManager = Router();

houseResourceManager.use(authMiddleware);

houseResourceManager.use("/category", categoryRouter);
houseResourceManager.use("/user", userRouter);

export {
    houseResourceManager,
}
