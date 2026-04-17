import { Router } from "express";
import { authUseCases } from "@/apps/monexo/shared/di/root";
import { AuthValidator } from "./validators";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
	const payload = AuthValidator.loginValidator.parse(req.body);

	const loginResponse = await authUseCases.login(
		payload.username,
		payload.password,
	);
	res.status(200).json(loginResponse);
});

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
