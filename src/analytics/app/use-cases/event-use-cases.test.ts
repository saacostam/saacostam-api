import { describe, expect, it } from "vitest";
import { MOCK_EVENTS, mockContext } from "../../test";
import { EventUseCases } from "./event-use-cases";

describe("EventUseCases", () => {
    describe("createEvent", () => {
        it("should commit event to repository", () => {
            const { ctx, analyticsEventsRepositoryCreate, dateProviderNow} = mockContext();

            const uc = new EventUseCases(ctx);

            const createdAt = new Date(123);

            dateProviderNow.mockReturnValueOnce(createdAt);
            uc.createEvent({
                name: "name",
                payload: "payload",
            });

            expect(dateProviderNow).toHaveBeenCalledOnce();
            expect(analyticsEventsRepositoryCreate).toHaveBeenCalledExactlyOnceWith({
                name: "name",
                payload: "payload",
                createdAt,
            })
        })
    })

    describe("queryAll", () => {
        it("should fetch all events", async () => {
            const { ctx, analyticsEventsRepositoryGetAll } = mockContext();

            const uc = new EventUseCases(ctx);

            analyticsEventsRepositoryGetAll.mockReturnValueOnce(MOCK_EVENTS);
            const queryAllResult = await uc.queryAll();

            expect(queryAllResult.events).toBe(MOCK_EVENTS);
        })
    })
})
