import { vi } from "vitest";
import type { IContext } from "@/apps/analytics/app";

export function mockContext() {
	// Providers
	const prov = {
		date: {
			now: vi.fn(),
		},
		uuid: {
			gen: vi.fn(),
		},
	} satisfies IContext["prov"];

	// Repositories
	const repo = {
		event: {
			create: vi.fn(),
			getAll: vi.fn(),
		}
	} satisfies IContext["repo"];

	const ctx: IContext = {
		prov,
		repo,
	};

	return {
		ctx,
		prov,
		repo,
	};
}
