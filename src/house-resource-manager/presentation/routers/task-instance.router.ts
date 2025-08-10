import { Router } from "express";
import { getIdFromRequest } from "../../../core.utils";
import { taskInstanceUseCasesService } from "../../infra/di";
import type { TGetAllTaskInstancesResponse } from "../dtos";
import { UnauthorizedError } from "../errors";

const taskInstanceRouter = Router();

taskInstanceRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result: TGetAllTaskInstancesResponse =
		await taskInstanceUseCasesService.getAllTaskInstances({
			userId,
		});
	res.status(200).json(result);
});

export { taskInstanceRouter };
