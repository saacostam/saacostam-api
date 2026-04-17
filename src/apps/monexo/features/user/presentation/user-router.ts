import { Router } from "express";
import { userUseCases, withAuth } from "@/apps/monexo/shared/di/root";

export const userRouter = Router();

userRouter.get(
	"/",
	withAuth(async (req, res) => {
		const user = await userUseCases.getUser(req.user.userId);
		res.status(200).json(user);
	}),
);
