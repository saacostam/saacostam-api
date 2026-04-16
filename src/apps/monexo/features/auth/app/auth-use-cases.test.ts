import { beforeEach, describe, expect, it } from "vitest";
import { mockDiContext } from "@/apps/monexo/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { AuthUseCases } from "./auth-use-cases";

describe("AuthUseCases.signUp", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: AuthUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new AuthUseCases(ctx);
	});

	it("throws conflict error when username is not unique", async () => {
		ctx.repo.user.filterByUsername.mockResolvedValue([
			{ id: "1", username: "taken" },
		]);

		try {
			await useCases.signUp(
				{ field: "username", value: "taken" },
				{ field: "password", value: "123" },
			);
		} catch (err) {
			expect(err).toBeInstanceOf(BaseDomainError);
			const error = err as BaseDomainError;

			expect(error.type).toBe(DomainErrorType.CONFLICT);
			expect(error.message).toContain("Username taken");

			// field-level validation
			expect(error.errors?.[0]).toEqual({
				field: "username",
				message: "Username already in use",
			});
		}

		expect(ctx.repo.user.create).not.toHaveBeenCalled();
		expect(ctx.prov.pwHasher.hash).not.toHaveBeenCalled();
	});

	it("creates user when username is unique", async () => {
		ctx.repo.user.filterByUsername.mockResolvedValue([]);
		ctx.prov.pwHasher.hash.mockResolvedValue("hashed_pw");
		ctx.prov.genId.gen.mockReturnValue("generated-id");

		await useCases.signUp(
			{ field: "username", value: "newuser" },
			{ field: "password", value: "123" },
		);

		expect(ctx.prov.pwHasher.hash).toHaveBeenCalledWith("123");
		expect(ctx.prov.genId.gen).toHaveBeenCalled();

		expect(ctx.repo.user.create).toHaveBeenCalledWith({
			id: "generated-id",
			username: "newuser",
			passwordHash: "hashed_pw",
		});
	});
});
