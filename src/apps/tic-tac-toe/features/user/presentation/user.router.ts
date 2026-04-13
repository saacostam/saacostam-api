import { Router } from "express";
import { userUseCases } from "@/apps/tic-tac-toe/shared/di-root";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";

export const userRouter = Router();

const userIdNotFound = (ctx: string) =>
	new BaseDomainError({
		type: DomainErrorType.BAD_REQUEST,
		message: `[gameRouter.${ctx}] User id not found`,
		userMessage: "User ID is required but was not provided",
	});

userRouter.get("/:userId", async (req, res) => {
	const userId = req.params.userId;
	if (!userId) throw userIdNotFound("queryUserGames");

	const user = await userUseCases.getUser(userId);
	res.status(200).json(user);
});
