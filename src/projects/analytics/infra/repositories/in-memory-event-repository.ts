import type { IEventRepository } from "@/projects/analytics/app";
import type { IEvent } from "@/projects/analytics/domain";

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
