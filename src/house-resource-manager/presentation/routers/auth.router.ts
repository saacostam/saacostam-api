import { Router } from "express";
import { authUseCasesService } from "../../infra/di";
import { AuthValidator } from "../validators";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    const payload = AuthValidator.signUpValidator.parse(req.body);

    const result = await authUseCasesService.signUp(payload);
    res.status(200).json(result);
})
 
export {
    authRouter,
}
