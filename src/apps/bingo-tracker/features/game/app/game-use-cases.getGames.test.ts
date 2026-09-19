import { beforeEach, describe, expect, it } from "vitest";
import type { Game } from "@/apps/bingo-tracker/features/game/domain";
import { mockDiContext } from "@/apps/bingo-tracker/shared/di/test";
import { GameUseCases } from "./game-use-cases";

describe("GameUseCases.getGames (integration-style)", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: GameUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new GameUseCases(ctx);
	});

	it("returns games for the user", async () => {
		ctx.repo.game.getAllByUserId.mockResolvedValue([
			{
				id: "game-1",
				name: "Game 1",
				userId: "user-1",
				createdAt: 1_757_000_000_000,
				boardTemplateId: "board-template-id-1",
			},
			{
				id: "game-2",
				name: "Game 2",
				userId: "user-1",
				createdAt: 1_758_000_000_000,
				boardTemplateId: "board-template-id-2",
			},
		]);

		const result = await useCases.getGames({
			userId: "user-1",
		});

		expect(result).toEqual([
			{
				id: "game-1",
				name: "Game 1",
				userId: "user-1",
				createdAt: 1_757_000_000_000,
				boardTemplateId: "board-template-id-1",
			},
			{
				id: "game-2",
				name: "Game 2",
				userId: "user-1",
				createdAt: 1_758_000_000_000,
				boardTemplateId: "board-template-id-2",
			},
		]);

		expect(ctx.repo.game.getAllByUserId).toHaveBeenCalledTimes(1);
		expect(ctx.repo.game.getAllByUserId).toHaveBeenCalledWith("user-1");
	});

	it("returns an empty array when the user has no games", async () => {
		ctx.repo.game.getAllByUserId.mockResolvedValue([]);

		const result = await useCases.getGames({
			userId: "user-1",
		});

		expect(result).toEqual([]);

		expect(ctx.repo.game.getAllByUserId).toHaveBeenCalledTimes(1);
		expect(ctx.repo.game.getAllByUserId).toHaveBeenCalledWith("user-1");
	});

	it("returns only the fields exposed by the game payload", async () => {
		ctx.repo.game.getAllByUserId.mockResolvedValue([
			{
				id: "game-1",
				name: "Game 1",
				userId: "user-1",
				createdAt: 1_757_000_000_000,
				boardTemplateId: "board-template-id-1",
				secretField: "should-not-leak",
			} as Game,
		]);

		const result = await useCases.getGames({
			userId: "user-1",
		});

		expect(result).toEqual([
			{
				id: "game-1",
				name: "Game 1",
				userId: "user-1",
				createdAt: 1_757_000_000_000,
				boardTemplateId: "board-template-id-1",
			},
		]);

		expect(result[0]).not.toHaveProperty("secretField");
	});
});
