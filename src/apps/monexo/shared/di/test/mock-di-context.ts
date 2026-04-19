import { vi } from "vitest";
import type { IContext } from "@/apps/monexo/shared/di/app";

export function mockDiContext() {
	const repo = {
		category: {
			create: vi.fn(),
			delete: vi.fn(),
			getAllPublic: vi.fn(),
			getAllPrivate: vi.fn(),
			getById: vi.fn(),
			updateCategory: vi.fn(),
		},
		expense: {
			create: vi.fn(),
			delete: vi.fn(),
			getAllByUserId: vi.fn(),
			getById: vi.fn(),
			update: vi.fn(),
		},
		user: {
			create: vi.fn(),
			getById: vi.fn(),
			getUserWithHashByUsername: vi.fn(),
			filterByUsername: vi.fn(),
		},
	} satisfies IContext["repo"];

	const prov = {
		errorLogger: {
			log: vi.fn(),
		},
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
