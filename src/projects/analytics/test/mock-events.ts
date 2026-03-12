import type { IEvent } from "../domain";

export const MOCK_EVENTS: IEvent[] = [
	{
		id: "1",
		name: "test-name-1",
		payload: "test-payload-1",
		createdAt: new Date(200),
	},
	{
		id: "2",
		name: "test-name-2",
		payload: "test-payload-2",
		createdAt: new Date(200),
	},
];
