import { Router } from "express";
import { resourceUseCasesService } from "@/apps/hrm/infra";
import { getIdFromRequest } from "@/shared/core.utils";
import type {
	TCreateResourceResponse,
	TGetAllResourcesResponse,
	TGetResourceByIdResponse,
	TUpdateResourceResponse,
} from "../dtos";
import { ID_FIELD_NOT_FOUND_ERROR, UnauthorizedError } from "../errors";
import { ResourceValidator } from "../validators";

const resourceRouter = Router();

resourceRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result: TGetAllResourcesResponse =
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
	const result: TCreateResourceResponse =
		await resourceUseCasesService.createResource({
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
	const result: TUpdateResourceResponse =
		await resourceUseCasesService.updateResource({
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
