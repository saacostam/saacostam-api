import type { IEvent } from "../../domain";
import type { IContext } from "../context";

export class EventUseCases {
	constructor(private ctx: IContext) {}

	async createEvent(
		req: EventUseCasesPayload["CreateEventRequest"],
	): Promise<void> {
		const newEvent: IEvent = {
			name: req.name,
			payload: req.payload,
			createdAt: this.ctx.dateProvider.now(),
		};

		await this.ctx.analyticsEventsRepository.create(newEvent);
	}
}

export interface EventUseCasesPayload {
	CreateEventRequest: {
		name: string;
		payload: string;
	};
}
