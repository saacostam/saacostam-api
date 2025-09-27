import { Router } from "express";
import { getIdFromRequest } from "../../../core.utils";
import { boardUseCasesService } from "../../infra/di";
import { ID_FIELD_NOT_FOUND_ERROR, UnauthorizedError } from "../errors";
import { BoardValidator } from "../validators";

const boardRouter = Router();

boardRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result = await boardUseCasesService.getAllBoards({
		userId,
	});
	res.status(200).json(result);
});

boardRouter.get("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result = await boardUseCasesService.getBoardById({
		id,
		userId,
	});
	res.status(200).json(result);
});

boardRouter.post("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = BoardValidator.createValidator.parse(req.body);
	const result = await boardUseCasesService.createBoard({
		...input,
		userId,
	});
	res.status(201).json(result);
});

boardRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = BoardValidator.updateValidator.parse(req.body);
	const result = await boardUseCasesService.updateBoard({
		id,
		content: input.content,
		name: input.name,
		userId,
	});
	res.status(200).json(result);
});

boardRouter.delete("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	await boardUseCasesService.deleteBoard({ id, userId });
	res.status(204).json();
});

export { boardRouter };
