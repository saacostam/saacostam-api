import { Router } from "express";
import {
	allowListUseCases,
	userUseCases,
	withAuth,
} from "@/apps/bingo-tracker/shared/di/root";

export const userRouter = Router();

userRouter.get(
	"/",
	withAuth(async (req, res) => {
		const user = await userUseCases.getUser(req.user.userId);

		res.status(200).json(user);
	}),
);

userRouter.get(
	"/capabilities",
	withAuth(async (req, res) => {
		const capabilities = await allowListUseCases.getCapabilities({
			userId: req.user.userId,
		});

		res.status(200).json(capabilities);
	}),
);
