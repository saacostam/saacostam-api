import { describe, expect, it } from "vitest";
import type { IEvent } from "../../domain";
import { MOCK_EVENTS, mockContext } from "../../test";
import { EventUseCases } from "./event-use-cases";

describe("EventUseCases", () => {
	describe("createEvent", () => {
		it("should commit event to repository", () => {
			const {
				ctx,
				analyticsEventsRepositoryCreate,
				dateProviderNow,
				uuidProviderGen,
			} = mockContext();

			const uc = new EventUseCases(ctx);

			const createdAt = new Date(123);

			dateProviderNow.mockReturnValueOnce(createdAt);
			uuidProviderGen.mockReturnValueOnce("id");

			uc.createEvent({
				name: "name",
				payload: "payload",
			});

			expect(dateProviderNow).toHaveBeenCalledOnce();

			const createEventPayload: IEvent = {
				id: "id",
				name: "name",
				payload: "payload",
				createdAt,
			};
			expect(analyticsEventsRepositoryCreate).toHaveBeenCalledExactlyOnceWith(
				createEventPayload,
			);
		});
	});

	describe("queryAll", () => {
		it("should fetch all events", async () => {
			const { ctx, analyticsEventsRepositoryGetAll } = mockContext();

			const uc = new EventUseCases(ctx);

			analyticsEventsRepositoryGetAll.mockReturnValueOnce(MOCK_EVENTS);
			const queryAllResult = await uc.queryAll();

			expect(queryAllResult.events).toBe(MOCK_EVENTS);
		});
	});
});
