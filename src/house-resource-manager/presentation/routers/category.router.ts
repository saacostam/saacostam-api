import { Router } from "express";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import { categoryUseCasesService } from "../../infra/di";
import { CategoryValidator } from "../validators";

const categoryRouter = Router();

categoryRouter.get("/", async (_req, res) => {
	const result = await categoryUseCasesService.getResources();
	res.status(200).json(result);
});

categoryRouter.post("/", async (req, res) => {
	const input = CategoryValidator.createValidator.parse(req.body);
	const result = await categoryUseCasesService.createResource(input);
	res.status(201).json(result);
});

categoryRouter.put("/:id", async (req, res) => {
	const id = req.params.id;

	if (!id) throw idFieldNotFoundError;

	const input = CategoryValidator.updateValidator.parse(req.body);
	const result = await categoryUseCasesService.updateResource({
		id,
		name: input.name,
		description: input.description,
	});
	res.status(200).json(result);
});

categoryRouter.delete("/:id", async (req, res) => {
	const id = req.params.id;

	if (!id) throw idFieldNotFoundError;

	await categoryUseCasesService.deleteResource({ id });
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
