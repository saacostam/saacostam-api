import { Router } from "express";
import { getIdFromRequest } from "../../../core.utils";
import { scratchBoardUseCasesService } from "../../infra/di";
import { ID_FIELD_NOT_FOUND_ERROR, UnauthorizedError } from "../errors";
import { ScratchBoardValidator } from "../validators";

const scratchBoardRouter = Router();

scratchBoardRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result = await scratchBoardUseCasesService.getAllScratchBoards({
		userId,
	});
	res.status(200).json(result);
});

scratchBoardRouter.get("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result = await scratchBoardUseCasesService.getScratchBoardById({
		id,
		userId,
	});
	res.status(200).json(result);
});

scratchBoardRouter.post("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = ScratchBoardValidator.createValidator.parse(req.body);
	const result = await scratchBoardUseCasesService.createScratchBoard({
		...input,
		userId,
	});
	res.status(201).json(result);
});

scratchBoardRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = ScratchBoardValidator.updatevalidator.parse(req.body);
	const result = await scratchBoardUseCasesService.updateScratchBoard({
		id,
		content: input.content,
		name: input.name,
		userId,
	});
	res.status(200).json(result);
});

scratchBoardRouter.delete("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	await scratchBoardUseCasesService.deleteScratchBoard({ id, userId });
	res.status(204).json();
});

export { scratchBoardRouter };
