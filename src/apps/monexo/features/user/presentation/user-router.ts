import { Router } from "express";
import { userUseCases } from "@/apps/monexo/shared/di/root";
import { errorFactory } from "@/apps/monexo/shared/errors";

export const userRouter = Router();

userRouter.get("/:userId", async (req, res) => {
	const userId = req.params.userId;
	if (!userId)
		throw errorFactory.fieldMissing({
			ctx: "userRouter.getById",
			field: {
				detailedName: "user id",
				name: "userId",
			},
		});

	const user = await userUseCases.getUser(userId);
	res.status(200).json(user);
});
