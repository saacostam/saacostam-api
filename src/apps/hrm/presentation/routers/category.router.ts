import { Router } from "express";
import { categoryUseCasesService } from "@/apps/hrm/infra";
import { getIdFromRequest } from "@/shared/core.utils";
import { ID_FIELD_NOT_FOUND_ERROR, UnauthorizedError } from "../errors";
import { CategoryValidator } from "../validators";

const categoryRouter = Router();

categoryRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result = await categoryUseCasesService.getCategories({ userId });
	res.status(200).json(result);
});

categoryRouter.get("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result = await categoryUseCasesService.getCategoryById({ id, userId });
	res.status(200).json(result);
});

categoryRouter.post("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = CategoryValidator.createValidator.parse(req.body);
	const result = await categoryUseCasesService.createCategory({
		...input,
		userId,
	});
	res.status(201).json(result);
});

categoryRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = CategoryValidator.updateValidator.parse(req.body);
	const result = await categoryUseCasesService.updateCategory({
		id,
		name: input.name,
		description: input.description,
		userId,
	});
	res.status(200).json(result);
});

categoryRouter.delete("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw ID_FIELD_NOT_FOUND_ERROR;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	await categoryUseCasesService.deleteCategory({ id, userId });
	res.status(204).json();
});

export { categoryRouter };
