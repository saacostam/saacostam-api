import { Router } from "express";
import { authUseCases } from "@/apps/monexo/shared/di/root";
import { AuthValidator } from "./validators";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
	const payload = AuthValidator.signUpValidator.parse(req.body);

	await authUseCases.signUp(
		{
			field: "username",
			value: payload.username,
		},
		{
			field: "password",
			value: payload.password,
		},
	);
	res.status(201).json();
});
