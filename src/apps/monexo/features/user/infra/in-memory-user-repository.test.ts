import { beforeEach, describe, expect, it } from "vitest";
import type { IUserWithHash } from "@/apps/monexo/features/user/domain";
import { InMemoryUserRepository } from "./in-memory-user-repository";

describe("InMemoryUserRepository", () => {
	let repo: InMemoryUserRepository;

	beforeEach(() => {
		repo = new InMemoryUserRepository();
	});

	const mockUser: IUserWithHash = {
		id: "1",
		username: "santiago",
		passwordHash: "hashed-password",
	};

	describe("create", () => {
		it("returns only public fields", async () => {
			const result = await repo.create(mockUser);

			expect(result).toEqual({
				id: "1",
				username: "santiago",
			});

			expect(result).not.toHaveProperty("passwordHash");
		});

		it("stores user internally with passwordHash intact", async () => {
			await repo.create(mockUser);

			const internal = await repo.getUserWithHashByUsername("santiago");

			expect(internal).toEqual(mockUser);
		});
	});

	describe("getById", () => {
		it("returns user without leaking passwordHash", async () => {
			await repo.create(mockUser);

			const result = await repo.getById("1");

			expect(result).toEqual({
				id: "1",
				username: "santiago",
			});

			expect(result).not.toHaveProperty("passwordHash");
		});

		it("returns null when user is not found", async () => {
			const result = await repo.getById("missing");

			expect(result).toBeNull();
		});
	});

	describe("getUserWithHashByUsername", () => {
		it("returns full user including passwordHash", async () => {
			await repo.create(mockUser);

			const result = await repo.getUserWithHashByUsername("santiago");

			expect(result).toEqual(mockUser);
		});

		it("returns null when user is not found", async () => {
			const result = await repo.getUserWithHashByUsername("missing");

			expect(result).toBeNull();
		});
	});

	describe("filterByUsername", () => {
		it("returns matching users", async () => {
			const userA: IUserWithHash = {
				id: "1",
				username: "santiago",
				passwordHash: "hash1",
			};

			const userB: IUserWithHash = {
				id: "2",
				username: "santiago",
				passwordHash: "hash2",
			};

			const userC: IUserWithHash = {
				id: "3",
				username: "other",
				passwordHash: "hash3",
			};

			await repo.create(userA);
			await repo.create(userB);
			await repo.create(userC);

			const result = await repo.filterByUsername("santiago");

			expect(result).toHaveLength(2);
			expect(result).toEqual([
				{ id: "1", username: "santiago" },
				{ id: "2", username: "santiago" },
			]);
		});

		it("returns empty array when no users match", async () => {
			await repo.create(mockUser);

			const result = await repo.filterByUsername("missing");

			expect(result).toEqual([]);
		});

		it("does not leak passwordHash", async () => {
			await repo.create(mockUser);

			const result = await repo.filterByUsername("santiago");

			for (const user of result) {
				expect(user).not.toHaveProperty("passwordHash");
			}
		});
	});
});
