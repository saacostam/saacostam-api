import type { IEventRepository } from "@/apps/analytics/app";
import type { IEvent } from "@/apps/analytics/domain";

export class InMemoryEventRepository implements IEventRepository {
	private events: IEvent[] = [];

	async create(event: IEvent): Promise<IEvent> {
		this.events.push(event);
		return event;
	}

	async getAll(): Promise<IEvent[]> {
		return this.events.map((e) => ({ ...e }));
	}
}
