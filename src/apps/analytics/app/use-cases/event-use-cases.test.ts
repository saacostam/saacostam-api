import { describe, expect, it } from "vitest";
import type { IEvent } from "@/apps/analytics/domain";
import { MOCK_EVENTS, mockContext } from "@/apps/analytics/test";
import { EventUseCases } from "./event-use-cases";

describe("EventUseCases", () => {
	describe("createEvent", () => {
		it("should commit event to repository", () => {
			const { ctx, prov, repo } = mockContext();

			const uc = new EventUseCases(ctx);

			const createdAt = new Date(123);

			prov.date.now.mockReturnValueOnce(createdAt);
			prov.uuid.gen.mockReturnValueOnce("id");

			uc.createEvent({
				name: "name",
				payload: "payload",
			});

			expect(prov.date.now).toHaveBeenCalledOnce();

			const createEventPayload: IEvent = {
				id: "id",
				name: "name",
				payload: "payload",
				createdAt,
			};
			expect(repo.event.create).toHaveBeenCalledExactlyOnceWith(
				createEventPayload,
			);
		});
	});

	describe("queryAll", () => {
		it("should fetch all events", async () => {
			const { ctx, repo } = mockContext();

			const uc = new EventUseCases(ctx);

			repo.event.getAll.mockReturnValueOnce(MOCK_EVENTS);
			const queryAllResult = await uc.queryAll();

			expect(queryAllResult.events).toBe(MOCK_EVENTS);
		});
	});
});
