import { vi } from "vitest";
import type { IContext } from "@/apps/monexo/shared/di/app";

export function mockDiContext() {
	const repo = {
		user: {
			create: vi.fn(),
			getById: vi.fn(),
			getUserWithHashByUsername: vi.fn(),
		},
	} satisfies IContext["repo"];

	return {
		repo,
	} satisfies IContext;
}
