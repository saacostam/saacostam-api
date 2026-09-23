import { type Mock, vi } from "vitest";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";

export function mockDiContext() {
	return {
		adapter: {
			date: {
				now: vi.fn(),
			},
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
			vision: {
				extractBoard: vi.fn(),
			},
		},
		repo: {
			board: {
				create: vi.fn(),
				delete: vi.fn(),
				getAllByIdList: vi.fn(),
				getAllByGameId: vi.fn(),
				getById: vi.fn(),
				updateById: vi.fn(),
			},
			boardTemplate: {
				create: vi.fn(),
				delete: vi.fn(),
				getById: vi.fn(),
				update: vi.fn(),
			},
			game: {
				create: vi.fn(),
				delete: vi.fn(),
				getAllByUserId: vi.fn(),
				getByBoardTemplateId: vi.fn(),
				getById: vi.fn(),
			},
			play: {
				create: vi.fn(),
				delete: vi.fn(),
				getAllByGameIdList: vi.fn(),
				getById: vi.fn(),
				updateById: vi.fn(),
			},
			user: {
				create: vi.fn(),
				getById: vi.fn(),
				getUserWithHashByUsername: vi.fn(),
				filterByUsername: vi.fn(),
			},
		},
	} satisfies Mocked<Context>;
}

type Mocked<T> = {
	[K in keyof T]: T[K] extends (...args: infer A) => infer R
		? Mock<(...args: A) => R>
		: T[K] extends object
			? Mocked<T[K]>
			: T[K];
};
