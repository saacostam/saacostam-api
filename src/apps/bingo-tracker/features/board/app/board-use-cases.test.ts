import { beforeEach, describe, expect, it } from "vitest";
import type { Board } from "@/apps/bingo-tracker/features/board/domain";
import { mockDiContext } from "@/apps/bingo-tracker/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { BoardUseCases } from "./board-use-cases";

describe("BoardUseCases", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: BoardUseCases;

	const board: Board = {
		id: "board-1",
		name: "My Board",
		gameId: "game-1",
		values: [
			[1, 2, 3],
			[4, undefined, 6],
			[7, 8, 9],
		],
	};

	const game = {
		id: "game-1",
		name: "My Game",
		userId: "user-1",
		createdAt: 1_757_000_000_000,
		boardTemplateId: "board-template-1",
	};

	describe("create", () => {
		beforeEach(() => {
			ctx = mockDiContext();
			useCases = new BoardUseCases(ctx);
		});

		it("creates a board and returns its id", async () => {
			ctx.repo.game.getById.mockResolvedValue(game);
			ctx.adapter.idGen.gen.mockReturnValue("board-1");

			ctx.repo.board.create.mockResolvedValue(board);

			const values: Board["values"] = [
				[1, 2, 3],
				[4, undefined, 6],
				[7, 8, 9],
			];

			const result = await useCases.create({
				gameId: "game-1",
				name: "My Board",
				userId: "user-1",
				values,
			});

			expect(result).toEqual({
				id: "board-1",
			});

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

			expect(ctx.adapter.idGen.gen).toHaveBeenCalledTimes(1);

			expect(ctx.repo.board.create).toHaveBeenCalledExactlyOnceWith({
				id: "board-1",
				name: "My Board",
				gameId: "game-1",
				values,
			});
		});

		it("throws domain error when the game is not found", async () => {
			ctx.repo.game.getById.mockResolvedValue(null);

			await expect(
				useCases.create({
					gameId: "game-1",
					name: "My Board",
					userId: "user-1",
					values: board.values,
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.board.create).not.toHaveBeenCalled();

			try {
				await useCases.create({
					gameId: "game-1",
					name: "My Board",
					userId: "user-1",
					values: board.values,
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Game with id game-1 was not found");
				expect(error.message).toContain("[BoardUseCases.create]");
				expect(error.userMessage).toBe("Game not found");
			}
		});

		it("throws domain error when the game belongs to another user", async () => {
			ctx.repo.game.getById.mockResolvedValue({
				...game,
				userId: "user-2",
			});

			await expect(
				useCases.create({
					gameId: "game-1",
					name: "My Board",
					userId: "user-1",
					values: board.values,
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.board.create).not.toHaveBeenCalled();

			try {
				await useCases.create({
					gameId: "game-1",
					name: "My Board",
					userId: "user-1",
					values: board.values,
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Game with id game-1 was not found");
				expect(error.message).toContain("[BoardUseCases.create]");
				expect(error.userMessage).toBe("Game not found");
			}
		});
	});

	describe("delete", () => {
		beforeEach(() => {
			ctx = mockDiContext();
			useCases = new BoardUseCases(ctx);
		});

		it("deletes a board when found and owned by the user", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue(game);

			await useCases.delete({
				boardId: "board-1",
				userId: "user-1",
			});

			expect(ctx.repo.board.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.board.getById).toHaveBeenCalledWith("board-1");

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

			expect(ctx.repo.board.delete).toHaveBeenCalledTimes(1);
			expect(ctx.repo.board.delete).toHaveBeenCalledWith("board-1");
		});

		it("throws domain error when the board is not found", async () => {
			ctx.repo.board.getById.mockResolvedValue(null);

			await expect(
				useCases.delete({
					boardId: "board-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.game.getById).not.toHaveBeenCalled();
			expect(ctx.repo.board.delete).not.toHaveBeenCalled();

			try {
				await useCases.delete({
					boardId: "board-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.delete]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});

		it("throws domain error when the board's game is not found", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue(null);

			await expect(
				useCases.delete({
					boardId: "board-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.board.delete).not.toHaveBeenCalled();

			try {
				await useCases.delete({
					boardId: "board-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.delete]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});

		it("throws domain error when the board belongs to another user", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue({
				...game,
				userId: "user-2",
			});

			await expect(
				useCases.delete({
					boardId: "board-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.board.delete).not.toHaveBeenCalled();

			try {
				await useCases.delete({
					boardId: "board-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.delete]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});
	});

	describe("getById", () => {
		beforeEach(() => {
			ctx = mockDiContext();
			useCases = new BoardUseCases(ctx);
		});

		it("returns the board when found and owned by the user", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue(game);

			const result = await useCases.getById({
				boardId: "board-1",
				userId: "user-1",
			});

			expect(result).toEqual({
				board,
			});

			expect(ctx.repo.board.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.board.getById).toHaveBeenCalledWith("board-1");

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");
		});

		it("throws domain error when the board is not found", async () => {
			ctx.repo.board.getById.mockResolvedValue(null);

			await expect(
				useCases.getById({
					boardId: "board-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.game.getById).not.toHaveBeenCalled();

			try {
				await useCases.getById({
					boardId: "board-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.getById]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});

		it("throws domain error when the board's game is not found", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue(null);

			await expect(
				useCases.getById({
					boardId: "board-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			try {
				await useCases.getById({
					boardId: "board-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.getById]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});

		it("throws domain error when the board belongs to another user", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue({
				...game,
				userId: "user-2",
			});

			await expect(
				useCases.getById({
					boardId: "board-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			try {
				await useCases.getById({
					boardId: "board-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.getById]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});
	});

	describe("update", () => {
		beforeEach(() => {
			ctx = mockDiContext();
			useCases = new BoardUseCases(ctx);
		});

		it("updates a board when found and owned by the user", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue(game);

			const values: Board["values"] = [
				[10, 20, 30],
				[40, undefined, 60],
				[70, 80, 90],
			];

			await useCases.update({
				boardId: "board-1",
				userId: "user-1",
				board: {
					name: "Updated Board",
					values,
				},
			});

			expect(ctx.repo.board.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.board.getById).toHaveBeenCalledWith("board-1");

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

			expect(ctx.repo.board.updateById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.board.updateById).toHaveBeenCalledWith("board-1", {
				...board,
				name: "Updated Board",
				values,
			});
		});

		it("throws domain error when the board is not found", async () => {
			ctx.repo.board.getById.mockResolvedValue(null);

			await expect(
				useCases.update({
					boardId: "board-1",
					userId: "user-1",
					board: {
						name: "Updated Board",
						values: board.values,
					},
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.game.getById).not.toHaveBeenCalled();
			expect(ctx.repo.board.updateById).not.toHaveBeenCalled();

			try {
				await useCases.update({
					boardId: "board-1",
					userId: "user-1",
					board: {
						name: "Updated Board",
						values: board.values,
					},
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.update]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});

		it("throws domain error when the board's game is not found", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue(null);

			await expect(
				useCases.update({
					boardId: "board-1",
					userId: "user-1",
					board: {
						name: "Updated Board",
						values: board.values,
					},
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.board.updateById).not.toHaveBeenCalled();

			try {
				await useCases.update({
					boardId: "board-1",
					userId: "user-1",
					board: {
						name: "Updated Board",
						values: board.values,
					},
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.update]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});

		it("throws domain error when the board belongs to another user", async () => {
			ctx.repo.board.getById.mockResolvedValue(board);
			ctx.repo.game.getById.mockResolvedValue({
				...game,
				userId: "user-2",
			});

			await expect(
				useCases.update({
					boardId: "board-1",
					userId: "user-1",
					board: {
						name: "Updated Board",
						values: board.values,
					},
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.board.updateById).not.toHaveBeenCalled();

			try {
				await useCases.update({
					boardId: "board-1",
					userId: "user-1",
					board: {
						name: "Updated Board",
						values: board.values,
					},
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Board with id board-1 was not found");
				expect(error.message).toContain("[BoardUseCases.update]");
				expect(error.message).toContain("Board not found");
				expect(error.userMessage).toBe("Board not found");
			}
		});
	});
});
