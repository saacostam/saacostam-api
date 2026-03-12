import { Router } from "express";
import { eventUseCases } from "../../infra";
import { EventValidator } from "../validators";

const eventRouter = Router();

eventRouter.get("/", async (_, res) => {
	const response = await eventUseCases.queryAll();
	res.status(200).json(response);
});

eventRouter.post("/", async (req, res) => {
	const payload = EventValidator.createEventInputSchema.parse(req.body);
	const response = await eventUseCases.createEvent(payload);
	res.status(201).json(response);
});

export { eventRouter };
