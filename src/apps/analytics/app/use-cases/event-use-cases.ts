import type { IEvent } from "@/apps/analytics/domain";
import type { IContext } from "../context";

export class EventUseCases {
	constructor(private ctx: IContext) {}

	async createEvent(
		req: EventUseCasesPayload["CreateEventRequest"],
	): Promise<void> {
		const newEvent: IEvent = {
			id: this.ctx.prov.uuid.gen(),
			name: req.name,
			payload: req.payload ?? null,
			createdAt: this.ctx.prov.date.now(),
		};

		await this.ctx.repo.event.create(newEvent);
	}

	async queryAll(): Promise<EventUseCasesPayload["QueryAllResponse"]> {
		const events = await this.ctx.repo.event.getAll();

		return {
			events,
		};
	}
}

export interface EventUseCasesPayload {
	CreateEventRequest: {
		name: string;
		payload?: string | null;
	};

	QueryAllResponse: {
		events: IEvent[];
	};
}
