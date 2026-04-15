import { Router } from "express";
import { errorHandlerMiddleware } from "@/shared/errors/presentation";

export const monexoRouter = Router();

monexoRouter.get("/health", (_, res) => {
	res.status(200).json();
});

monexoRouter.use(errorHandlerMiddleware);
