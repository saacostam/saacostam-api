import { beforeEach, describe, expect, it } from "vitest";
import {
	type BoardTemplate,
	DEFAULT_BOARD_TEMPLATE,
} from "@/apps/bingo-tracker/features/board-template/domain";
import { mockDiContext } from "@/apps/bingo-tracker/shared/di/test";
import { GameUseCases } from "./game-use-cases";

describe("GameUseCases", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: GameUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new GameUseCases(ctx);
	});

	it("creates a game and returns its id", async () => {
		ctx.adapter.idGen.gen
			.mockReturnValueOnce("board-template-1")
			.mockReturnValueOnce("game-1");
		ctx.adapter.date.now.mockReturnValue(1_757_000_000_000);

		ctx.repo.boardTemplate.create.mockResolvedValueOnce({
			id: "board-template-1",
		} as BoardTemplate);
		ctx.repo.game.create.mockResolvedValue({
			id: "game-1",
			name: "My Game",
			userId: "user-1",
			createdAt: 1_757_000_000_000,
			boardTemplateId: "board-template-1",
		});

		const result = await useCases.createGame({
			name: "My Game",
			userId: "user-1",
		});

		expect(result).toEqual({
			gameId: "game-1",
		});

		expect(ctx.adapter.idGen.gen).toHaveBeenCalledTimes(2);
		expect(ctx.adapter.date.now).toHaveBeenCalledTimes(1);

		expect(ctx.repo.boardTemplate.create).toHaveBeenCalledExactlyOnceWith({
			...DEFAULT_BOARD_TEMPLATE,
			id: "board-template-1",
		});
		expect(ctx.repo.game.create).toHaveBeenCalledExactlyOnceWith({
			id: "game-1",
			name: "My Game",
			userId: "user-1",
			createdAt: 1_757_000_000_000,
			boardTemplateId: "board-template-1",
		});
	});
});
