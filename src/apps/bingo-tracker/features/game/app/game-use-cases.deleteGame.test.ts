import { beforeEach, describe, expect, it } from "vitest";
import { mockDiContext } from "@/apps/bingo-tracker/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { GameUseCases } from "./game-use-cases";

describe("GameUseCases.deleteGame (integration-style)", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: GameUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new GameUseCases(ctx);
	});

	it("deletes a game when found and owned by the user", async () => {
		ctx.repo.game.getById.mockResolvedValue({
			id: "game-1",
			name: "My Game",
			userId: "user-1",
			createdAt: 1_757_000_000_000,
		});

		ctx.repo.game.delete.mockResolvedValue(undefined);

		await useCases.deleteGame({
			gameId: "game-1",
			userId: "user-1",
		});

		expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
		expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

		expect(ctx.repo.game.delete).toHaveBeenCalledTimes(1);
		expect(ctx.repo.game.delete).toHaveBeenCalledWith("game-1");
	});

	it("throws domain error when game is not found", async () => {
		ctx.repo.game.getById.mockResolvedValue(null);

		await expect(
			useCases.deleteGame({
				gameId: "game-1",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(BaseDomainError);

		expect(ctx.repo.game.delete).not.toHaveBeenCalled();

		try {
			await useCases.deleteGame({
				gameId: "game-1",
				userId: "user-1",
			});
		} catch (err) {
			expect(err).toBeInstanceOf(BaseDomainError);

			const error = err as BaseDomainError;

			expect(error.type).toBe(DomainErrorType.NOT_FOUND);
			expect(error.message).toContain("Game with id game-1 was not found");
			expect(error.message).toContain("[GameUseCases.deleteGame]");
			expect(error.userMessage).toBe("Game not found");
		}
	});

	it("throws domain error when game belongs to another user", async () => {
		ctx.repo.game.getById.mockResolvedValue({
			id: "game-1",
			name: "My Game",
			userId: "user-2",
			createdAt: 1_757_000_000_000,
		});

		await expect(
			useCases.deleteGame({
				gameId: "game-1",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(BaseDomainError);

		expect(ctx.repo.game.delete).not.toHaveBeenCalled();

		try {
			await useCases.deleteGame({
				gameId: "game-1",
				userId: "user-1",
			});
		} catch (err) {
			expect(err).toBeInstanceOf(BaseDomainError);

			const error = err as BaseDomainError;

			expect(error.type).toBe(DomainErrorType.NOT_FOUND);
			expect(error.message).toContain("Game with id game-1 was not found");
			expect(error.message).toContain("[GameUseCases.deleteGame]");
			expect(error.userMessage).toBe("Game not found");
		}
	});
});
