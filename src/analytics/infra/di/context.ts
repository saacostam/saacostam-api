import type { IContext } from "../../app";
import { SimpleDateProvider } from "../providers";
import { InMemoryEventRepository } from "../repositories";

export const context: IContext = {
	dateProvider: new SimpleDateProvider(),
	analyticsEventsRepository: new InMemoryEventRepository(),
};
