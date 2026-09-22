import { beforeEach, describe, expect, it } from "vitest";
import type { Board } from "@/apps/bingo-tracker/features/board/domain";
import type { BoardTemplate } from "@/apps/bingo-tracker/features/board-template/domain";
import type { Game } from "@/apps/bingo-tracker/features/game/domain";
import { mockDiContext } from "@/apps/bingo-tracker/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { GameUseCases } from "./game-use-cases";

describe("GameUseCases.getById (integration-style)", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: GameUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new GameUseCases(ctx);
	});

	it("returns the game with its boards and board template", async () => {
		const game: Game = {
			id: "game-1",
			name: "My Game",
			createdAt: 123456,
			userId: "user-1",
			boardTemplateId: "template-1",
		};

		const boardTemplate: BoardTemplate = {
			id: "template-1",
			grid: [[{ type: "available" }, { type: "blocked" }]],
			boardRange: {
				min: 1,
				max: 75,
			},
		};

		const boards: Board[] = [
			{
				id: "board-1",
				name: "Board 1",
				values: [[1, 2, 3]],
				gameId: "game-1",
			},
			{
				id: "board-2",
				name: "Board 2",
				values: [[4, 5, 6]],
				gameId: "game-1",
			},
		];

		ctx.repo.game.getById.mockResolvedValue(game);
		ctx.repo.boardTemplate.getById.mockResolvedValue(boardTemplate);
		ctx.repo.board.getAllByGameId.mockResolvedValue(boards);

		const result = await useCases.getById({
			gameId: "game-1",
			userId: "user-1",
		});

		expect(result).toEqual({
			game: {
				...game,
				boardTemplate,
				boards,
			},
		});

		expect(ctx.repo.game.getById).toHaveBeenCalledExactlyOnceWith("game-1");
		expect(ctx.repo.boardTemplate.getById).toHaveBeenCalledExactlyOnceWith(
			"template-1",
		);
		expect(ctx.repo.board.getAllByGameId).toHaveBeenCalledExactlyOnceWith(
			"game-1",
		);
	});

	it("throws when the game does not exist", async () => {
		ctx.repo.game.getById.mockResolvedValue(null);

		await expect(
			useCases.getById({
				gameId: "game-1",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(BaseDomainError);

		expect(ctx.repo.boardTemplate.getById).not.toHaveBeenCalled();
		expect(ctx.repo.board.getAllByGameId).not.toHaveBeenCalled();

		try {
			await useCases.getById({
				gameId: "game-1",
				userId: "user-1",
			});
		} catch (error) {
			expect(error).toMatchObject({
				type: DomainErrorType.NOT_FOUND,
				message: "[GameUseCases.getById] Game with id game-1 was not found",
				userMessage: "Game not found",
			});
		}
	});

	it("throws when the user does not own the game", async () => {
		const game: Game = {
			id: "game-1",
			name: "My Game",
			createdAt: 123456,
			userId: "user-2",
			boardTemplateId: "template-1",
		};

		ctx.repo.game.getById.mockResolvedValue(game);

		await expect(
			useCases.getById({
				gameId: "game-1",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(BaseDomainError);

		expect(ctx.repo.boardTemplate.getById).not.toHaveBeenCalled();
		expect(ctx.repo.board.getAllByGameId).not.toHaveBeenCalled();

		try {
			await useCases.getById({
				gameId: "game-1",
				userId: "user-1",
			});
		} catch (error) {
			expect(error).toMatchObject({
				type: DomainErrorType.NOT_FOUND,
				message: "[GameUseCases.getById] Game with id game-1 was not found",
				userMessage: "Game not found",
			});
		}
	});

	it("throws when the game's board template does not exist", async () => {
		const game: Game = {
			id: "game-1",
			name: "My Game",
			createdAt: 123456,
			userId: "user-1",
			boardTemplateId: "template-1",
		};

		ctx.repo.game.getById.mockResolvedValue(game);
		ctx.repo.boardTemplate.getById.mockResolvedValue(null);

		await expect(
			useCases.getById({
				gameId: "game-1",
				userId: "user-1",
			}),
		).rejects.toBeInstanceOf(BaseDomainError);

		expect(ctx.repo.board.getAllByGameId).not.toHaveBeenCalled();

		try {
			await useCases.getById({
				gameId: "game-1",
				userId: "user-1",
			});
		} catch (error) {
			expect(error).toMatchObject({
				type: DomainErrorType.NOT_FOUND,
				userMessage: "Board template not found",
			});
		}
	});

	it("returns the game with an empty boards array when it has no boards", async () => {
		const game: Game = {
			id: "game-1",
			name: "My Game",
			createdAt: 123456,
			userId: "user-1",
			boardTemplateId: "template-1",
		};

		const boardTemplate: BoardTemplate = {
			id: "template-1",
			grid: [[{ type: "available" }]],
			boardRange: {
				min: 1,
				max: 75,
			},
		};

		ctx.repo.game.getById.mockResolvedValue(game);
		ctx.repo.boardTemplate.getById.mockResolvedValue(boardTemplate);
		ctx.repo.board.getAllByGameId.mockResolvedValue([]);

		const result = await useCases.getById({
			gameId: "game-1",
			userId: "user-1",
		});

		expect(result).toEqual({
			game: {
				...game,
				boardTemplate,
				boards: [],
			},
		});
	});
});
