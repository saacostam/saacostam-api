import { Router } from "express";
import { timezoneUseCasesService } from "@/apps/hrm/infra";

const timezoneRouter = Router();

timezoneRouter.get("/iana", async (_, res) => {
	const result = await timezoneUseCasesService.getTimezones();
	res.status(200).json(result);
});

export { timezoneRouter };
