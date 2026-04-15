import { beforeEach, describe, expect, it } from "vitest";
import { mockDiContext } from "@/apps/monexo/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { UserUseCases } from "./user-use-cases";

describe("UserUseCases (integration-style)", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: UserUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new UserUseCases(ctx);
	});

	it("returns user when found", async () => {
		ctx.repo.user.getById.mockResolvedValue({
			id: "1",
			username: "santiago",
		});

		const result = await useCases.getUser("1");

		expect(result).toEqual({
			id: "1",
			username: "santiago",
		});

		expect(ctx.repo.user.getById).toHaveBeenCalledWith("1");
	});

	it("throws domain error when user not found", async () => {
		ctx.repo.user.getById.mockResolvedValue(null);

		await expect(useCases.getUser("1")).rejects.toBeInstanceOf(BaseDomainError);

		try {
			await useCases.getUser("1");
		} catch (err) {
			expect(err).toBeInstanceOf(BaseDomainError);

			const error = err as BaseDomainError;

			expect(error.type).toBe(DomainErrorType.NOT_FOUND);
			expect(error.message).toContain("User with id 1 was not found");
			expect(error.message).toContain("[UserUseCases.getUser]");
		}
	});

	it("calls repository with correct id", async () => {
		ctx.repo.user.getById.mockResolvedValue({
			id: "1",
			username: "santiago",
		});

		await useCases.getUser("1");

		expect(ctx.repo.user.getById).toHaveBeenCalledTimes(1);
		expect(ctx.repo.user.getById).toHaveBeenCalledWith("1");
	});
});
