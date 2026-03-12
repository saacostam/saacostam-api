import type { IContext } from "@/apps/analytics/app";
import { SimpleDateProvider, SimpleUuidProvider } from "../providers";
import { InMemoryEventRepository } from "../repositories";

export const context: IContext = {
	prov: {
		date: new SimpleDateProvider(),
		uuid: new SimpleUuidProvider(),
	},
	repo: {
		event: new InMemoryEventRepository(),
	},
};
