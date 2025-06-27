import { Router } from "express";
import { categoryUseCasesService } from "../../infra/di";
import { CategoryValidator } from "../validators";

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
 
export {
    categoryRouter,
}
