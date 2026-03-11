import type { IContext } from "../../app";
import { SimpleDateProvider, SimpleUuidProvider } from "../providers";
import { InMemoryEventRepository } from "../repositories";

export const context: IContext = {
	dateProvider: new SimpleDateProvider(),
	uuidProvider: new SimpleUuidProvider(),
	analyticsEventsRepository: new InMemoryEventRepository(),
};
