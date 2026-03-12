import type { IEvent } from "@/apps/analytics/domain";

export interface IEventRepository {
	create(event: IEvent): Promise<IEvent>;
	getAll(): Promise<IEvent[]>;
}
