import { vi } from "vitest";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";

export function mockDiContext() {
	return {
		adapter: {
			errorLogger: {
				log: vi.fn(),
			},
			idGen: {
				gen: vi.fn(),
			},
			pwHasher: {
				compare: vi.fn(),
				hash: vi.fn(),
			},
			token: {
				getToken: vi.fn(),
				validateToken: vi.fn(),
			},
		},
	} satisfies Context;
}
