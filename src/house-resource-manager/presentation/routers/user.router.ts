import { Router } from "express";
import { getIdFromRequest } from "../../../core.utils";
import { userUseCasesService } from "../../infra/di";
import { UnauthorizedError } from "../errors";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
    const id = getIdFromRequest(req);

    if (!id) throw new UnauthorizedError();

    const result = await userUseCasesService.getMe({ id });
    res.status(200).json(result);
})
 
export {
    userRouter,
}
