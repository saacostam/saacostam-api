import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import type { IGame, ITurn } from "./game-entity";

type IBoardStatus = string | null;
type IBoardRow = [IBoardStatus, IBoardStatus, IBoardStatus];
type IBoard = [IBoardRow, IBoardRow, IBoardRow];

class GameService {
	public static MAX_PLAYERS = 2;

	applyTurn(game: IGame, turn: ITurn): IGame {
		const board = this.createBoardFromTurns(game.turns);

		// Validate cell
		const cell = board.at(turn.y)?.at(turn.x);
		if (cell === undefined) {
			throw new BaseDomainError({
				type: DomainErrorType.BAD_REQUEST,
				userMessage: "Invalid game position - Out of range",
				message: `[GameService.applyTurn] invalid game move - turn does not map to board cell. Game id: ${game.id}`,
			});
		}

		if (cell !== null) {
			throw new BaseDomainError({
				type: DomainErrorType.CONFLICT,
				userMessage: "Invalid game position - Position is not empty",
				message: `[GameService.applyTurn] invalid game move - board cell already filled out. Game id: ${game.id}`,
			});
		}

		// Determinte last player
		const lastPlayer = game.turns.at(-1)?.playerId ?? game.userIds.at(1);
		if (!lastPlayer) {
			throw new BaseDomainError({
				type: DomainErrorType.CONFLICT,
				userMessage: "Invalid game state - No players were found",
				message: `[GameService.applyTurn] invalid game state - no player were found. Game id: ${game.id}`,
			});
		}

		if (lastPlayer === turn.playerId) {
			throw new BaseDomainError({
				type: DomainErrorType.CONFLICT,
				userMessage: "Invalid game move - It's another player's turn.",
				message: `[GameService.applyTurn] invalid game move - not the user's turn. Game id: ${game.id}`,
			});
		}

		// OK
		return {
			id: game.id,
			userIds: [...game.userIds],
			turns: [...game.turns, turn],
			status: game.status,
			winnerPlayerId: game.winnerPlayerId,
		};
	}

	checkWinCondition(game: IGame):
		| {
				hasWinCondition: true;
				winnerUserId: string;
		  }
		| {
				hasWinCondition: false;
		  } {
		const board = this.createBoardFromTurns(game.turns);

		for (const userId of game.userIds) {
			if (this.hasWin(board, userId)) {
				return {
					hasWinCondition: true,
					winnerUserId: userId,
				};
			}
		}

		return {
			hasWinCondition: false,
		};
	}

	createBoardFromTurns(turns: ITurn[]): IBoard {
		const board = this.createEmptyBoard();

		for (const turn of turns) {
			const cell = board.at(turn.y)?.at(turn.x);

			if (cell !== undefined) {
				board[turn.y][turn.x] = turn.playerId;
			}
		}

		return board;
	}

	createEmptyBoard(): IBoard {
		return [
			[null, null, null],
			[null, null, null],
			[null, null, null],
		];
	}

	isOpen(game: IGame): boolean {
		return game.userIds.length < GameService.MAX_PLAYERS;
	}

	hasWin(board: IBoard, playerId: string): boolean {
		const isPlayer = (cell: IBoardStatus): boolean => {
			return cell !== null && cell === playerId;
		};

		// Rows
		for (let r = 0; r < 3; r++) {
			if (
				isPlayer(board[r][0]) &&
				isPlayer(board[r][1]) &&
				isPlayer(board[r][2])
			) {
				return true;
			}
		}

		// Columns
		for (let c = 0; c < 3; c++) {
			if (
				isPlayer(board[0][c]) &&
				isPlayer(board[1][c]) &&
				isPlayer(board[2][c])
			) {
				return true;
			}
		}

		// Diagonals
		if (
			isPlayer(board[0][0]) &&
			isPlayer(board[1][1]) &&
			isPlayer(board[2][2])
		) {
			return true;
		}

		if (
			isPlayer(board[0][2]) &&
			isPlayer(board[1][1]) &&
			isPlayer(board[2][0])
		) {
			return true;
		}

		return false;
	}
}

export const gameService = new GameService();
