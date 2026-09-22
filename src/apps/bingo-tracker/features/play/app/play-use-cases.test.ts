import { beforeEach, describe, expect, it } from "vitest";
import type { BoardTemplate } from "@/apps/bingo-tracker/features/board-template/domain";
import type { Pattern, Play } from "@/apps/bingo-tracker/features/play/domain";
import { mockDiContext } from "@/apps/bingo-tracker/shared/di/test";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { PlayUseCases } from "./play-use-cases";

describe("PlayUseCases", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: PlayUseCases;

	const game = {
		id: "game-1",
		name: "My Game",
		userId: "user-1",
		createdAt: 1_757_000_000_000,
		boardTemplateId: "board-template-1",
	};

	const template: BoardTemplate = {
		id: "board-template-1",
		grid: [
			[{ type: "available" }, { type: "available" }, { type: "available" }],
			[{ type: "available" }, { type: "blocked" }, { type: "available" }],
			[{ type: "available" }, { type: "available" }, { type: "available" }],
		],
		boardRange: {
			min: 1,
			max: 75,
		},
	};

	const play: Play = {
		id: "play-1",
		name: "My Play",
		gameId: "game-1",
		startedAt: 1_757_000_000_000,
		takenNumbers: [1, 5, 9],
		patterns: [
			{
				id: "pattern-1",
				body: [
					[true, false, true],
					[false, true, false],
					[true, false, true],
				],
			},
		],
	};

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new PlayUseCases(ctx);
	});

	describe("create", () => {
		it("creates a play and returns its id", async () => {
			ctx.repo.game.getById.mockResolvedValue(game);
			ctx.repo.boardTemplate.getById.mockResolvedValue(template);

			ctx.adapter.idGen.gen
				.mockReturnValueOnce("pattern-1")
				.mockReturnValueOnce("play-1");

			ctx.adapter.date.now.mockReturnValue(1_757_000_000_000);

			ctx.repo.play.create.mockResolvedValue(play);

			const result = await useCases.create({
				gameId: "game-1",
				userId: "user-1",
				name: "My Play",
			});

			expect(result).toEqual({
				id: "play-1",
			});

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

			expect(ctx.repo.boardTemplate.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.boardTemplate.getById).toHaveBeenCalledWith(
				"board-template-1",
			);

			expect(ctx.adapter.idGen.gen).toHaveBeenCalledTimes(2);
			expect(ctx.adapter.date.now).toHaveBeenCalledTimes(1);

			expect(ctx.repo.play.create).toHaveBeenCalledExactlyOnceWith({
				id: "play-1",
				name: "My Play",
				gameId: "game-1",
				startedAt: 1_757_000_000_000,
				takenNumbers: [],
				patterns: [
					{
						id: "pattern-1",
						body: [
							[true, true, true],
							[true, false, true],
							[true, true, true],
						],
					},
				],
			});
		});

		it("throws domain error when the game is not found", async () => {
			ctx.repo.game.getById.mockResolvedValue(null);

			await expect(
				useCases.create({
					gameId: "game-1",
					userId: "user-1",
					name: "My Play",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.boardTemplate.getById).not.toHaveBeenCalled();
			expect(ctx.repo.play.create).not.toHaveBeenCalled();

			try {
				await useCases.create({
					gameId: "game-1",
					userId: "user-1",
					name: "My Play",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Game with id game-1 was not found");
				expect(error.message).toContain("[PlayUseCases.create]");
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
					userId: "user-1",
					name: "My Play",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.boardTemplate.getById).not.toHaveBeenCalled();
			expect(ctx.repo.play.create).not.toHaveBeenCalled();

			try {
				await useCases.create({
					gameId: "game-1",
					userId: "user-1",
					name: "My Play",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Game with id game-1 was not found");
				expect(error.message).toContain("[PlayUseCases.create]");
				expect(error.userMessage).toBe("Game not found");
			}
		});

		it("throws domain error when the board template is not found", async () => {
			ctx.repo.game.getById.mockResolvedValue(game);
			ctx.repo.boardTemplate.getById.mockResolvedValue(null);

			await expect(
				useCases.create({
					gameId: "game-1",
					userId: "user-1",
					name: "My Play",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.play.create).not.toHaveBeenCalled();

			try {
				await useCases.create({
					gameId: "game-1",
					userId: "user-1",
					name: "My Play",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain(
					"Board template with id board-template-1 was not found",
				);
				expect(error.message).toContain("[PlayUseCases.create]");
				expect(error.userMessage).toBe("Board template not found");
			}
		});
	});

	describe("getAllByGameId", () => {
		it("returns all plays for the user's game", async () => {
			ctx.repo.game.getById.mockResolvedValue(game);
			ctx.repo.play.getAllByGameIdList.mockResolvedValue([play]);

			const result = await useCases.getAllByGameId({
				gameId: "game-1",
				userId: "user-1",
			});

			expect(result).toEqual({
				plays: [play],
			});

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

			expect(ctx.repo.play.getAllByGameIdList).toHaveBeenCalledTimes(1);
			expect(ctx.repo.play.getAllByGameIdList).toHaveBeenCalledWith(["game-1"]);
		});

		it("returns an empty array when the game has no plays", async () => {
			ctx.repo.game.getById.mockResolvedValue(game);
			ctx.repo.play.getAllByGameIdList.mockResolvedValue([]);

			const result = await useCases.getAllByGameId({
				gameId: "game-1",
				userId: "user-1",
			});

			expect(result).toEqual({
				plays: [],
			});

			expect(ctx.repo.play.getAllByGameIdList).toHaveBeenCalledWith(["game-1"]);
		});

		it("throws domain error when the game is not found", async () => {
			ctx.repo.game.getById.mockResolvedValue(null);

			await expect(
				useCases.getAllByGameId({
					gameId: "game-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.play.getAllByGameIdList).not.toHaveBeenCalled();

			try {
				await useCases.getAllByGameId({
					gameId: "game-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Game with id game-1 was not found");
				expect(error.message).toContain("[PlayUseCases.getAllByGameId]");
				expect(error.userMessage).toBe("Game not found");
			}
		});

		it("throws domain error when the game belongs to another user", async () => {
			ctx.repo.game.getById.mockResolvedValue({
				...game,
				userId: "user-2",
			});

			await expect(
				useCases.getAllByGameId({
					gameId: "game-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.play.getAllByGameIdList).not.toHaveBeenCalled();

			try {
				await useCases.getAllByGameId({
					gameId: "game-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Game with id game-1 was not found");
				expect(error.message).toContain("[PlayUseCases.getAllByGameId]");
				expect(error.userMessage).toBe("Game not found");
			}
		});
	});

	describe("getById", () => {
		it("returns the play when found and owned by the user", async () => {
			ctx.repo.play.getById.mockResolvedValue(play);
			ctx.repo.game.getById.mockResolvedValue(game);

			const result = await useCases.getById({
				playId: "play-1",
				userId: "user-1",
			});

			expect(result).toEqual({
				play,
			});

			expect(ctx.repo.play.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.play.getById).toHaveBeenCalledWith("play-1");

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");
		});

		it("throws domain error when the play is not found", async () => {
			ctx.repo.play.getById.mockResolvedValue(null);

			await expect(
				useCases.getById({
					playId: "play-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.game.getById).not.toHaveBeenCalled();

			try {
				await useCases.getById({
					playId: "play-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Play with id play-1 was not found");
				expect(error.message).toContain("[PlayUseCases.getById]");
				expect(error.message).toContain("Play not found");
				expect(error.userMessage).toBe("Play not found");
			}
		});

		it("throws domain error when the play's game is not found", async () => {
			ctx.repo.play.getById.mockResolvedValue(play);
			ctx.repo.game.getById.mockResolvedValue(null);

			await expect(
				useCases.getById({
					playId: "play-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			try {
				await useCases.getById({
					playId: "play-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Play with id play-1 was not found");
				expect(error.message).toContain("[PlayUseCases.getById]");
				expect(error.message).toContain("Play not found");
				expect(error.userMessage).toBe("Play not found");
			}
		});

		it("throws domain error when the play belongs to another user", async () => {
			ctx.repo.play.getById.mockResolvedValue(play);
			ctx.repo.game.getById.mockResolvedValue({
				...game,
				userId: "user-2",
			});

			await expect(
				useCases.getById({
					playId: "play-1",
					userId: "user-1",
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			try {
				await useCases.getById({
					playId: "play-1",
					userId: "user-1",
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Play with id play-1 was not found");
				expect(error.message).toContain("[PlayUseCases.getById]");
				expect(error.message).toContain("Play not found");
				expect(error.userMessage).toBe("Play not found");
			}
		});
	});

	describe("takeNumber", () => {
		it("updates the taken numbers", async () => {
			ctx.repo.play.getById.mockResolvedValue(play);
			ctx.repo.game.getById.mockResolvedValue(game);

			const takenNumbers = [2, 4, 7, 10];

			await useCases.takeNumber({
				playId: "play-1",
				userId: "user-1",
				takenNumbers,
			});

			expect(ctx.repo.play.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.play.getById).toHaveBeenCalledWith("play-1");

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

			expect(ctx.repo.play.updateById).toHaveBeenCalledExactlyOnceWith(
				"play-1",
				{
					...play,
					takenNumbers,
				},
			);
		});

		it("throws domain error when the play is not found", async () => {
			ctx.repo.play.getById.mockResolvedValue(null);

			await expect(
				useCases.takeNumber({
					playId: "play-1",
					userId: "user-1",
					takenNumbers: [1, 2],
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.game.getById).not.toHaveBeenCalled();
			expect(ctx.repo.play.updateById).not.toHaveBeenCalled();

			try {
				await useCases.takeNumber({
					playId: "play-1",
					userId: "user-1",
					takenNumbers: [1, 2],
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Play with id play-1 was not found");
				expect(error.message).toContain("[PlayUseCases.takeNumber]");
				expect(error.message).toContain("Play not found");
				expect(error.userMessage).toBe("Play not found");
			}
		});

		it("throws domain error when the play belongs to another user", async () => {
			ctx.repo.play.getById.mockResolvedValue(play);
			ctx.repo.game.getById.mockResolvedValue({
				...game,
				userId: "user-2",
			});

			await expect(
				useCases.takeNumber({
					playId: "play-1",
					userId: "user-1",
					takenNumbers: [1, 2],
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.play.updateById).not.toHaveBeenCalled();

			try {
				await useCases.takeNumber({
					playId: "play-1",
					userId: "user-1",
					takenNumbers: [1, 2],
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Play with id play-1 was not found");
				expect(error.message).toContain("[PlayUseCases.takeNumber]");
				expect(error.message).toContain("Play not found");
				expect(error.userMessage).toBe("Play not found");
			}
		});
	});

	describe("updatePatterns", () => {
		it("updates patterns and generates ids for each pattern", async () => {
			ctx.repo.play.getById.mockResolvedValue(play);
			ctx.repo.game.getById.mockResolvedValue(game);

			ctx.adapter.idGen.gen
				.mockReturnValueOnce("pattern-2")
				.mockReturnValueOnce("pattern-3");

			const patterns: Pattern["body"][] = [
				[
					[true, false, false],
					[false, true, false],
					[false, false, true],
				],
				[
					[false, true, false],
					[true, true, true],
					[false, true, false],
				],
			];

			await useCases.updatePatterns({
				playId: "play-1",
				userId: "user-1",
				patterns,
			});

			expect(ctx.repo.play.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.play.getById).toHaveBeenCalledWith("play-1");

			expect(ctx.repo.game.getById).toHaveBeenCalledTimes(1);
			expect(ctx.repo.game.getById).toHaveBeenCalledWith("game-1");

			expect(ctx.adapter.idGen.gen).toHaveBeenCalledTimes(2);

			expect(ctx.repo.play.updateById).toHaveBeenCalledExactlyOnceWith(
				"play-1",
				{
					...play,
					patterns: [
						{
							id: "pattern-2",
							body: patterns[0],
						},
						{
							id: "pattern-3",
							body: patterns[1],
						},
					],
				},
			);
		});

		it("can replace the patterns with an empty array", async () => {
			ctx.repo.play.getById.mockResolvedValue(play);
			ctx.repo.game.getById.mockResolvedValue(game);

			await useCases.updatePatterns({
				playId: "play-1",
				userId: "user-1",
				patterns: [],
			});

			expect(ctx.adapter.idGen.gen).not.toHaveBeenCalled();

			expect(ctx.repo.play.updateById).toHaveBeenCalledExactlyOnceWith(
				"play-1",
				{
					...play,
					patterns: [],
				},
			);
		});

		it("throws domain error when the play is not found", async () => {
			ctx.repo.play.getById.mockResolvedValue(null);

			await expect(
				useCases.updatePatterns({
					playId: "play-1",
					userId: "user-1",
					patterns: [],
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.repo.game.getById).not.toHaveBeenCalled();
			expect(ctx.adapter.idGen.gen).not.toHaveBeenCalled();
			expect(ctx.repo.play.updateById).not.toHaveBeenCalled();

			try {
				await useCases.updatePatterns({
					playId: "play-1",
					userId: "user-1",
					patterns: [],
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Play with id play-1 was not found");
				expect(error.message).toContain("[PlayUseCases.updatePatterns]");
				expect(error.message).toContain("Play not found");
				expect(error.userMessage).toBe("Play not found");
			}
		});

		it("throws domain error when the play belongs to another user", async () => {
			ctx.repo.play.getById.mockResolvedValue(play);
			ctx.repo.game.getById.mockResolvedValue({
				...game,
				userId: "user-2",
			});

			await expect(
				useCases.updatePatterns({
					playId: "play-1",
					userId: "user-1",
					patterns: [],
				}),
			).rejects.toBeInstanceOf(BaseDomainError);

			expect(ctx.adapter.idGen.gen).not.toHaveBeenCalled();
			expect(ctx.repo.play.updateById).not.toHaveBeenCalled();

			try {
				await useCases.updatePatterns({
					playId: "play-1",
					userId: "user-1",
					patterns: [],
				});
			} catch (err) {
				expect(err).toBeInstanceOf(BaseDomainError);

				const error = err as BaseDomainError;

				expect(error.type).toBe(DomainErrorType.NOT_FOUND);
				expect(error.message).toContain("Play with id play-1 was not found");
				expect(error.message).toContain("[PlayUseCases.updatePatterns]");
				expect(error.message).toContain("Play not found");
				expect(error.userMessage).toBe("Play not found");
			}
		});
	});
});
