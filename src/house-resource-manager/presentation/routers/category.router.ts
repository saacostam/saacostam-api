import { Router } from "express";
import { categoryUseCasesService } from "../../infra/di";
import { CategoryValidator } from "../validators";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";

const categoryRouter = Router();

categoryRouter.get("/", async (req, res) => {
    const result = await categoryUseCasesService.getResources();
    res.status(200).json(result);
})

categoryRouter.post("/", async (req, res) => {
    const input = CategoryValidator.createValidator.parse(req.body);    
    const result = await categoryUseCasesService.createResource(input);
    res.status(201).json(result);
})

categoryRouter.put("/:id", async (req, res) => {
    const id = req.params.id;

    if (!id) throw new BaseDomainError(
        DomainErrorType.BAD_REQUEST,
        "Id field is required",
        [
            {
                field: "id",
                message: "REQUIRED",
            }
        ]
    );

    const input = CategoryValidator.updateValidator.parse(req.body);
    const result = await categoryUseCasesService.updateResource({
        id,
        name: input.name,
        description: input.description,
    })
    res.status(200).json(result);
})
 
export {
    categoryRouter,
}
