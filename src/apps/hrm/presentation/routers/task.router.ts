import { Router } from "express";
import { taskUseCasesService } from "@/apps/hrm/infra";
import { getIdFromRequest } from "@/shared/core.utils";
import type {
	TCreateTaskCompletionResponse,
	TGetAllTasksResponse,
	TGetTaskByIdResponse,
	TUpdateTaskResponse,
} from "../dtos";
import { ID_FIELD_NOT_FOUND_ERROR, UnauthorizedError } from "../errors";
import { TaskValidator } from "../validators";

const taskRouter = Router();

taskRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result: TGetAllTasksResponse = await taskUseCasesService.getTasks({
		userId,
	});
	res.status(200).json(result);
});

taskRouter.get("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result: TGetTaskByIdResponse = await taskUseCasesService.getTaskById({
		id,
		userId,
	});
	res.status(200).json(result);
});

taskRouter.post("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = TaskValidator.createValidator.parse(req.body);
	const result: TCreateTaskCompletionResponse =
		await taskUseCasesService.createTask({
			...input,
			userId,
		});
	res.status(201).json(result);
});

taskRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = TaskValidator.updateValidator.parse(req.body);
	const result: TUpdateTaskResponse = await taskUseCasesService.updateTask({
		id,
		...input,
		userId,
	});
	res.status(201).json(result);
});

taskRouter.delete("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	await taskUseCasesService.deleteTask({ id, userId });
	res.status(204).json();
});

export { taskRouter };
