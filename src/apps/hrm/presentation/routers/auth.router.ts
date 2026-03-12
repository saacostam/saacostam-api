import { Router } from "express";
import { authUseCasesService } from "../../infra/di";
import { AuthValidator } from "../validators";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
	const payload = AuthValidator.signUpValidator.parse(req.body);

	const result = await authUseCasesService.signUp({
		username: {
			value: payload.username,
			fieldName: "username",
		},
		firstName: {
			value: payload.firstName,
			fieldName: "firstName",
		},
		lastName: {
			value: payload.lastName,
			fieldName: "lastName",
		},
		password: {
			value: payload.password,
			fieldName: "password",
		},
		timezone: {
			value: payload.timezone,
			fieldName: "timezone",
		},
	});
	res.status(200).json(result);
});

authRouter.post("/login", async (req, res) => {
	const payload = AuthValidator.loginValidator.parse(req.body);

	const result = await authUseCasesService.logIn(payload);
	res.status(200).json(result);
});

export { authRouter };
