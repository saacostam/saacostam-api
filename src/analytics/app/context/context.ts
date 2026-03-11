import type { IDateProvider, IUuidProvider } from "../providers";
import type { IEventRepository } from "../repositories";

export interface IContext {
	// Providers
	dateProvider: IDateProvider;
	uuidProvider: IUuidProvider;

	// Repositories
	analyticsEventsRepository: IEventRepository;
}
