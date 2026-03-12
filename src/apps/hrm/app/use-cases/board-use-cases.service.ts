import { BaseDomainError, Board, DomainErrorType } from "@/apps/hrm/domain";
import { generateId } from "@/shared/utils";
import {
	type CreateBoardRequestDto,
	type DeleteBoardRequestDto,
	type GetAllBoardsRequestDto,
	type GetAllBoardsResponseDto,
	GetAllBoardsResponseDtoItem,
	type GetBoardByIdRequestDto,
	type UpdateBoardRequestDto,
} from "../dtos";
import type { HtmlSanitizationService } from "../providers";
import type { BoardRepository } from "../repositories";

export class BoardUseCasesService {
	constructor(
		private boardRepository: BoardRepository,
		private htmlSanitizationService: HtmlSanitizationService,
	) {}

	async createBoard({ name, userId }: CreateBoardRequestDto) {
		const board = new Board({
			id: generateId(),
			name: name,
			content: "",
			userId: userId,
		});

		const newEntry = await this.boardRepository.create(board);

		return {
			id: newEntry.id,
		};
	}

	async deleteBoard({ id, userId }: DeleteBoardRequestDto) {
		const board = await this._getExistingByIdOrFail(id, userId);
		return this.boardRepository.deleteById(board.id);
	}

	async getAllBoards({
		userId,
	}: GetAllBoardsRequestDto): Promise<GetAllBoardsResponseDto> {
		const boards = await this.boardRepository.getAllByUserId(userId);

		return {
			boards: boards.map(
				({ id, name, userId }) =>
					new GetAllBoardsResponseDtoItem(id, name, userId),
			),
		};
	}

	async getBoardById({ id, userId }: GetBoardByIdRequestDto) {
		return this._getExistingByIdOrFail(id, userId);
	}

	async updateBoard({
		id,
		userId,

		content: _rawContent,
		name,
	}: UpdateBoardRequestDto) {
		const existingEntry = await this._getExistingByIdOrFail(id, userId);

		const content = _rawContent
			? this.htmlSanitizationService.sanitizeHtml(_rawContent)
			: undefined;

		const updatedEntry = new Board({
			id: existingEntry.id,
			userId: existingEntry.userId,
			content: content === undefined ? existingEntry.content : content,
			name: name === undefined ? existingEntry.name : name,
		});

		const newEntry = await this.boardRepository.updateById(id, updatedEntry);

		return {
			id: newEntry.id,
		};
	}

	async _getExistingByIdOrFail(id: string, userId: string): Promise<Board> {
		const notFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Board with id ${id} not found`,
		);

		const existingEntry = await this.boardRepository.getById(id);

		if (!existingEntry) throw notFoundError;
		if (existingEntry.userId !== userId) throw notFoundError;

		return existingEntry;
	}
}
