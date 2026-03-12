import type { IEvent } from "../../domain";

export interface IEventRepository {
	create(event: IEvent): Promise<IEvent>;
	getAll(): Promise<IEvent[]>;
}
