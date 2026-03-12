import { Router } from "express";
import { getIdFromRequest } from "../../../../shared/core.utils";
import { MutationUpdateSettingsInDto } from "../../app/dtos";
import { userUseCasesService } from "../../infra/di";
import { UnauthorizedError } from "../errors";
import { UserValidator } from "../validators";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);

	if (!userId) throw new UnauthorizedError();

	const result = await userUseCasesService.getMe({ id: userId });
	res.status(200).json(result);
});

userRouter.put("/settings", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = UserValidator.updateSettingValidator.parse(req.body);

	const result = await userUseCasesService.updateSettings(
		new MutationUpdateSettingsInDto({
			timezone: input.timezone,
			userId,
		}),
	);

	res.status(200).json(result);
});

export { userRouter };
