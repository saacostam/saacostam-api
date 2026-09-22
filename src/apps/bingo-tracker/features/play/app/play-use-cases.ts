import type { Pattern, Play } from "@/apps/bingo-tracker/features/play/domain";
import type { Context } from "@/apps/bingo-tracker/shared/di/app";
import { errorFactory } from "@/apps/bingo-tracker/shared/errors";

export class PlayUseCases {
	constructor(private ctx: Context) {}

	async create({
		gameId,
		userId,
		name,
	}: PlayUseCasesPayload["create"]["req"]): Promise<
		PlayUseCasesPayload["create"]["res"]
	> {
		const game = await this.ctx.repo.game.getById(gameId);

		if (game === null || game.userId !== userId) {
			throw errorFactory.gameByIdNotFound({
				id: gameId,
				ctx: "PlayUseCases.create",
			});
		}

		const template = await this.ctx.repo.boardTemplate.getById(
			game.boardTemplateId,
		);
		if (template === null) {
			throw errorFactory.boardTemplateByIdNotFound({
				id: game.boardTemplateId,
				ctx: "PlayUseCases.create",
			});
		}

		const filledPattern: Pattern = {
			id: this.ctx.adapter.idGen.gen(),
			body: template.grid.map((row) =>
				row.map((cell) => cell.type === "available"),
			),
		};

		const createPlayPayload: Play = {
			id: this.ctx.adapter.idGen.gen(),
			name,
			gameId,
			startedAt: this.ctx.adapter.date.now(),
			takenNumbers: [],
			patterns: [filledPattern],
		};

		const createdPlay = await this.ctx.repo.play.create(createPlayPayload);

		return {
			id: createdPlay.id,
		};
	}

	async getAllByGameId({
		gameId,
		userId,
	}: PlayUseCasesPayload["getAllByGameId"]["req"]): Promise<
		PlayUseCasesPayload["getAllByGameId"]["res"]
	> {
		const game = await this.ctx.repo.game.getById(gameId);

		if (game === null || game.userId !== userId) {
			throw errorFactory.gameByIdNotFound({
				id: gameId,
				ctx: "PlayUseCases.getAllByGameId",
			});
		}

		const plays = await this.ctx.repo.play.getAllByGameIdList([gameId]);

		return {
			plays,
		};
	}

	async getById({
		playId,
		userId,
	}: PlayUseCasesPayload["getById"]["req"]): Promise<
		PlayUseCasesPayload["getById"]["res"]
	> {
		const play = await this.getAuthorizedPlay(
			playId,
			userId,
			"PlayUseCases.getById",
		);

		return {
			play,
		};
	}

	async takeNumber({
		playId,
		takenNumbers,
		userId,
	}: PlayUseCasesPayload["takeNumber"]["req"]): Promise<void> {
		const existingPlay = await this.getAuthorizedPlay(
			playId,
			userId,
			"PlayUseCases.takeNumber",
		);

		const updatePlayPayload: Play = {
			...existingPlay,
			takenNumbers,
		};

		await this.ctx.repo.play.updateById(existingPlay.id, updatePlayPayload);
	}

	async updatePatterns({
		playId,
		patterns,
		userId,
	}: PlayUseCasesPayload["updatePatterns"]["req"]): Promise<void> {
		const existingPlay = await this.getAuthorizedPlay(
			playId,
			userId,
			"PlayUseCases.updatePatterns",
		);

		const updatePlayPayload: Play = {
			...existingPlay,
			patterns: patterns.map((body) => ({
				id: this.ctx.adapter.idGen.gen(),
				body,
			})),
		};

		await this.ctx.repo.play.updateById(existingPlay.id, updatePlayPayload);
	}

	private async getAuthorizedPlay(
		playId: string,
		userId: string,
		ctx: string,
	): Promise<Play> {
		const play = await this.ctx.repo.play.getById(playId);

		if (!play) {
			throw errorFactory.playByIdNotFound({
				id: playId,
				ctx,
				append: "Play not found",
			});
		}

		const game = await this.ctx.repo.game.getById(play.gameId);

		if (!game || game.userId !== userId) {
			throw errorFactory.playByIdNotFound({
				id: playId,
				ctx,
				append: "Play not found",
			});
		}

		return play;
	}
}

export interface PlayUseCasesPayload {
	create: {
		req: {
			gameId: string;
			userId: string;
			name: string;
		};
		res: {
			id: string;
		};
	};
	getAllByGameId: {
		req: {
			userId: string;
			gameId: string;
		};
		res: {
			plays: Play[];
		};
	};
	getById: {
		req: {
			playId: string;
			userId: string;
		};
		res: {
			play: Play;
		};
	};
	takeNumber: {
		req: {
			playId: string;
			takenNumbers: number[];
			userId: string;
		};
	};
	updatePatterns: {
		req: {
			playId: string;
			patterns: Pattern["body"][];
			userId: string;
		};
	};
}
