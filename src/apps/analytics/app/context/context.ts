import type { IDateProvider, IUuidProvider } from "../providers";
import type { IEventRepository } from "../repositories";

export interface IContext {
	prov: {
		date: IDateProvider;
		uuid: IUuidProvider;
	};
	repo: {
		event: IEventRepository;
	};
}
