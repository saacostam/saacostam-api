import { Router } from "express";
import { getIdFromRequest } from "../../../core.utils";
import { taskInstanceUseCasesService } from "../../infra/di";
import type {
	TCreateTaskCompletionResponse,
	TGetImmediateTaskInstancesResponse,
} from "../dtos";
import { ID_FIELD_NOT_FOUND_ERROR, UnauthorizedError } from "../errors";
import { TaskInstanceValidator } from "../validators";

const taskInstanceRouter = Router();

taskInstanceRouter.get("/immediate", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result: TGetImmediateTaskInstancesResponse =
		await taskInstanceUseCasesService.getImmediateTaskInstances({
			userId,
		});
	res.status(200).json(result);
});

taskInstanceRouter.post("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = TaskInstanceValidator.createValidation.parse(req.body);
	const result: TCreateTaskCompletionResponse =
		await taskInstanceUseCasesService.createTaskInstanceCompletion({
			...input,
			userId,
		});

	res.status(201).json(result);
});

taskInstanceRouter.delete("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	await taskInstanceUseCasesService.deleteTaskInstanceCompletion({
		id,
		userId,
	});
	res.status(204).json();
});

export { taskInstanceRouter };
