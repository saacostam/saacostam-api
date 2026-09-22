import { beforeEach, describe, expect, it } from "vitest";
import type { BoardTemplate } from "@/apps/bingo-tracker/features/board-template/domain";
import { mockDiContext } from "@/apps/bingo-tracker/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { GameUseCases } from "./game-use-cases";

describe("GameUseCases.setBoardTemplate (integration-style)", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: GameUseCases;

	const game = {
		id: "game-1",
		name: "My Game",
		userId: "user-1",
		createdAt: 1_757_000_000_000,
		boardTemplateId: "board-template-1",
	};

	const boardTemplate: BoardTemplate = {
		id: "board-template-1",
		grid: [
			[{ type: "available" }, { type: "available" }, { type: "blocked" }],
			[{ type: "available" }, { type: "blocked" }, { type: "available" }],
			[{ type: "blocked" }, { type: "available" }, { type: "available" }],
		],
		boardRange: {
			min: 1,
			max: 90,
		},
	};

	const updatedGrid: BoardTemplate["grid"] = [
		[{ type: "available" }, { type: "blocked" }, { type: "available" }],
		[{ type: "blocked" }, { type: "available" }, { type: "available" }],
		[{ type: "available" }, { type: "available" }, { type: "blocked" }],
	];

	const updatedBoardRange: BoardTemplate["boardRange"] = {
		min: 1,
		max: 75,
	};

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new GameUseCases(ctx);
	});

	it("updates the board template when the game is found and owned by the user", async () => {
		ctx.repo.game.getById.mockResolvedValue(game);
		ctx.repo.boardTemplate.getById.mockResolvedValue(boardTemplate);
		ctx.repo.boardTemplate.update.mockResolvedValue(boardTemplate);

		await useCases.setBoardTemplate({
			gameId: "game-1",
			userId: "user-1",
			boardTemplate: {
				grid: updatedGrid,
				boardRange: updatedBoardRange,
			},
		});

		expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
		expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

		expect(ctx.repo.boardTemplate.getById).toHaveBeenCalledTimes(1);
		expect(ctx.repo.boardTemplate.getById).toHaveBeenCalledWith(
			"board-template-1",
		);

		expect(ctx.repo.boardTemplate.update).toHaveBeenCalledTimes(1);
		expect(ctx.repo.boardTemplate.update).toHaveBeenCalledWith(
			"board-template-1",
			{
				id: "board-template-1",
				grid: updatedGrid,
				boardRange: updatedBoardRange,
			},
		);
	});

	it("throws domain error when the game is not found", async () => {
		ctx.repo.game.getById.mockResolvedValue(null);

		await expect(
			useCases.setBoardTemplate({
				gameId: "game-1",
				userId: "user-1",
				boardTemplate: {
					grid: updatedGrid,
					boardRange: updatedBoardRange,
				},
			}),
		).rejects.toBeInstanceOf(BaseDomainError);

		expect(ctx.repo.boardTemplate.getById).not.toHaveBeenCalled();
		expect(ctx.repo.boardTemplate.update).not.toHaveBeenCalled();

		try {
			await useCases.setBoardTemplate({
				gameId: "game-1",
				userId: "user-1",
				boardTemplate: {
					grid: updatedGrid,
					boardRange: updatedBoardRange,
				},
			});
		} catch (err) {
			expect(err).toBeInstanceOf(BaseDomainError);

			const error = err as BaseDomainError;

			expect(error.type).toBe(DomainErrorType.NOT_FOUND);
			expect(error.message).toContain("Game with id game-1 was not found");
			expect(error.message).toContain("[GameUseCases.setBoardTemplate]");
			expect(error.userMessage).toBe("Game not found");
		}
	});

	it("throws domain error when the game belongs to another user", async () => {
		ctx.repo.game.getById.mockResolvedValue({
			...game,
			userId: "user-2",
		});

		await expect(
			useCases.setBoardTemplate({
				gameId: "game-1",
				userId: "user-1",
				boardTemplate: {
					grid: updatedGrid,
					boardRange: updatedBoardRange,
				},
			}),
		).rejects.toBeInstanceOf(BaseDomainError);

		expect(ctx.repo.boardTemplate.getById).not.toHaveBeenCalled();
		expect(ctx.repo.boardTemplate.update).not.toHaveBeenCalled();

		try {
			await useCases.setBoardTemplate({
				gameId: "game-1",
				userId: "user-1",
				boardTemplate: {
					grid: updatedGrid,
					boardRange: updatedBoardRange,
				},
			});
		} catch (err) {
			expect(err).toBeInstanceOf(BaseDomainError);

			const error = err as BaseDomainError;

			expect(error.type).toBe(DomainErrorType.NOT_FOUND);
			expect(error.message).toContain("Game with id game-1 was not found");
			expect(error.message).toContain("[GameUseCases.setBoardTemplate]");
			expect(error.userMessage).toBe("Game not found");
		}
	});

	it("throws domain error when the board template is not found", async () => {
		ctx.repo.game.getById.mockResolvedValue(game);
		ctx.repo.boardTemplate.getById.mockResolvedValue(null);

		await expect(
			useCases.setBoardTemplate({
				gameId: "game-1",
				userId: "user-1",
				boardTemplate: {
					grid: updatedGrid,
					boardRange: updatedBoardRange,
				},
			}),
		).rejects.toBeInstanceOf(BaseDomainError);

		expect(ctx.repo.boardTemplate.update).not.toHaveBeenCalled();

		try {
			await useCases.setBoardTemplate({
				gameId: "game-1",
				userId: "user-1",
				boardTemplate: {
					grid: updatedGrid,
					boardRange: updatedBoardRange,
				},
			});
		} catch (err) {
			expect(err).toBeInstanceOf(BaseDomainError);

			const error = err as BaseDomainError;

			expect(error.type).toBe(DomainErrorType.NOT_FOUND);
			expect(error.message).toContain("Game with id game-1 was not found");
			expect(error.message).toContain("[GameUseCases.setBoardTemplate]");
			expect(error.userMessage).toBe("Game not found");
		}
	});
});
