import { Router } from "express";
import { timezoneUseCasesService } from "../../infra/di";

const timezoneRouter = Router();

timezoneRouter.get("/iana", async (_, res) => {
	const result = await timezoneUseCasesService.getTimezones();
	res.status(200).json(result);
});

export { timezoneRouter };
