import { beforeEach, describe, expect, it } from "vitest";
import type { IUserWithHash } from "@/apps/monexo/features/user/domain";
import { mockDiContext } from "@/apps/monexo/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { AuthUseCases } from "./auth-use-cases";

describe("AuthUseCases", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: AuthUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new AuthUseCases(ctx);
	});

	describe("login", () => {
		it("throws bad request when credentials are invalid (user not found)", async () => {
			ctx.repo.user.getUserWithHashByUsername.mockResolvedValue(null);

			await expect(
				useCases.login("username", "password"),
			).rejects.toMatchObject({
				type: DomainErrorType.BAD_REQUEST,
				userMessage: "Invalid login credentials",
			});

			expect(ctx.prov.pwHasher.compare).not.toHaveBeenCalled();
			expect(ctx.prov.jwt.getToken).not.toHaveBeenCalled();
		});

		it("throws bad request when credentials are invalid (wrong password)", async () => {
			// User exists
			const user: IUserWithHash = {
				id: "id",
				username: "username",
				passwordHash: "pw1",
			};
			ctx.repo.user.getUserWithHashByUsername.mockResolvedValue(user);

			// But the password is different
			ctx.prov.pwHasher.compare.mockResolvedValue(false);

			await expect(
				useCases.login("username", "password"),
			).rejects.toMatchObject({
				type: DomainErrorType.BAD_REQUEST,
				userMessage: "Invalid login credentials",
			});

			expect(ctx.prov.pwHasher.compare).toHaveBeenCalledExactlyOnceWith(
				"password",
				"pw1",
			);
			expect(ctx.prov.jwt.getToken).not.toHaveBeenCalled();
		});

		it("returns token when user exists and password matches", async () => {
			// User exists
			const user: IUserWithHash = {
				id: "id",
				username: "username",
				passwordHash: "pw1",
			};
			ctx.repo.user.getUserWithHashByUsername.mockResolvedValue(user);

			// And passwords match
			ctx.prov.pwHasher.compare.mockResolvedValue(true);

			const mockToken = "mock-token";
			ctx.prov.jwt.getToken.mockReturnValue(mockToken);

			const res = await useCases.login("username", "pw1");
			expect(res.token).toBe(mockToken);

			expect(ctx.prov.pwHasher.compare).toHaveBeenCalledExactlyOnceWith(
				"pw1",
				"pw1",
			);
			expect(ctx.prov.jwt.getToken).toHaveBeenCalledExactlyOnceWith({
				userId: "id",
			});
		});
	});

	describe("signup", () => {
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
});
