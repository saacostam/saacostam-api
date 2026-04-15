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

	it("creates a user and returns only public fields", async () => {
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

	it("gets user by id without leaking passwordHash", async () => {
		await repo.create(mockUser);

		const result = await repo.getById("1");

		expect(result).toEqual({
			id: "1",
			username: "santiago",
		});

		expect(result).not.toHaveProperty("passwordHash");
	});

	it("returns null when user is not found by id", async () => {
		const result = await repo.getById("missing");

		expect(result).toBeNull();
	});

	it("returns null when user is not found by username", async () => {
		const result = await repo.getUserWithHashByUsername("missing");

		expect(result).toBeNull();
	});
});
