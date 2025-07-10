import { getIdFromRequest } from "core.utils";
import { Router } from "express";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import { categoryUseCasesService } from "../../infra/di";
import { UnauthorizedError } from "../errors";
import { CategoryValidator } from "../validators";

const categoryRouter = Router();

categoryRouter.get("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const result = await categoryUseCasesService.getResources({ userId });
	res.status(200).json(result);
});

categoryRouter.post("/", async (req, res) => {
	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	const input = CategoryValidator.createValidator.parse(req.body);
	const result = await categoryUseCasesService.createResource({
		...input,
		userId,
	});
	res.status(201).json(result);
});

categoryRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	if (!id) throw idFieldNotFoundError;

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
	if (!id) throw idFieldNotFoundError;

	const userId = getIdFromRequest(req);
	if (!userId) throw new UnauthorizedError();

	await categoryUseCasesService.deleteResource({ id, userId });
	res.status(204).json();
});

export { categoryRouter };

const idFieldNotFoundError = new BaseDomainError(
	DomainErrorType.BAD_REQUEST,
	"Id field is required",
	[
		{
			field: "id",
			message: "REQUIRED",
		},
	],
);
