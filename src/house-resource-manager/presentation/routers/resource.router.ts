import { Router } from "express";
import { getIdFromRequest } from "../../../core.utils";
import { resourceUseCasesService } from "../../infra/di";
import type {
	TGetAllResourcsResponse,
	TGetResourceByIdResponse,
} from "../dtos";
import { ID_FIELD_NOT_FOUND_ERROR, UnauthorizedError } from "../errors";
import { ResourceValidator } from "../validators";

const resourceRouter = Router();

resourceRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result: TGetAllResourcsResponse =
		await resourceUseCasesService.getResources({ userId });
	res.status(200).json(result);
});

resourceRouter.get("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result: TGetResourceByIdResponse =
		await resourceUseCasesService.getResourceById({ id, userId });
	res.status(200).json(result);
});

resourceRouter.post("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = ResourceValidator.createValidator.parse(req.body);
	const result = await resourceUseCasesService.createResource({
		...input,
		userId,
	});
	res.status(201).json(result);
});

resourceRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = ResourceValidator.updateValidator.parse(req.body);
	const result = await resourceUseCasesService.updateResource({
		id,
		...input,
		userId,
	});
	res.status(200).json(result);
});

resourceRouter.delete("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	await resourceUseCasesService.deleteResource({ id, userId });
	res.status(204).json();
});

export { resourceRouter };
