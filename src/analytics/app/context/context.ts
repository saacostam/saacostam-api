import type { IDateProvider } from "../providers";
import type { IEventRepository } from "../repositories";

export interface IContext {
	// Providers
	dateProvider: IDateProvider;

	// Repositories
	analyticsEventsRepository: IEventRepository;
}
