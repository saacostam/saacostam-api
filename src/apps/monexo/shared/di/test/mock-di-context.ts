import { vi } from "vitest";
import type { IContext } from "@/apps/monexo/shared/di/app";

export function mockDiContext() {
	const repo = {
		user: {
			create: vi.fn(),
			getById: vi.fn(),
			getUserWithHashByUsername: vi.fn(),
			filterByUsername: vi.fn(),
		},
	} satisfies IContext["repo"];

	const prov = {
		genId: {
			gen: vi.fn(),
		},
		jwt: {
			getToken: vi.fn(),
			validateToken: vi.fn(),
		},
		pwHasher: {
			compare: vi.fn(),
			hash: vi.fn(),
		},
	} satisfies IContext["prov"];

	return {
		prov,
		repo,
	} satisfies IContext;
}
