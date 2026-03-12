import type { IEvent } from "@/projects/analytics/domain";

export interface IEventRepository {
	create(event: IEvent): Promise<IEvent>;
	getAll(): Promise<IEvent[]>;
}
