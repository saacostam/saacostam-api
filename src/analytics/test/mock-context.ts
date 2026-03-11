import { vi } from "vitest";
import type { IContext } from "../app";

export function mockContext() {
	// Providers
	const dateProviderNow = vi.fn();

	// Repositories
	const analyticsEventsRepositoryCreate = vi.fn();
	const analyticsEventsRepositoryGetAll = vi.fn();

	const ctx: IContext = {
		dateProvider: {
			now: dateProviderNow,
		},
		analyticsEventsRepository: {
			create: analyticsEventsRepositoryCreate,
			getAll: analyticsEventsRepositoryGetAll,
		},
	};

	return {
		ctx,
		// Providers
		dateProviderNow,
		// Repositories
		analyticsEventsRepositoryCreate,
		analyticsEventsRepositoryGetAll,
	};
}
