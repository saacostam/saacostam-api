import { vi } from "vitest";
import type { IContext } from "../app";

export function mockContext() {
	// Providers
	const dateProviderNow = vi.fn();

	const uuidProviderGen = vi.fn();

	// Repositories
	const analyticsEventsRepositoryCreate = vi.fn();
	const analyticsEventsRepositoryGetAll = vi.fn();

	const ctx: IContext = {
		dateProvider: {
			now: dateProviderNow,
		},
		uuidProvider: {
			gen: uuidProviderGen,
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
		uuidProviderGen,
		// Repositories
		analyticsEventsRepositoryCreate,
		analyticsEventsRepositoryGetAll,
	};
}
