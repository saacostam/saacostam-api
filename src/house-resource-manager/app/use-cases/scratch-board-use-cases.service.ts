import { generateId } from "../../../core.utils";

import { ScratchBoard } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import {
	type CreateScratchBoardRequestDto,
	type DeleteScratchBoardRequestDto,
	type GetAllScratchBoardsRequestDto,
	type GetAllScratchBoardsResponseDto,
	GetAllScratchBoardsResponseDtoItem,
	type GetScratchBoardByIdRequestDto,
	type UpdateScratchBoardRequestDto,
} from "../dtos";
import type { ScratchBoardRepository } from "../repositories";

export class ScratchBoardUseCasesService {
	constructor(private scratchBoardRepository: ScratchBoardRepository) {}

	async createScratchBoard({ name, userId }: CreateScratchBoardRequestDto) {
		const scratchBoard = new ScratchBoard({
			id: generateId(),
			name: name,
			content: "",
			userId: userId,
		});

		const newEntry = await this.scratchBoardRepository.create(scratchBoard);

		return {
			id: newEntry.id,
		};
	}

	async deleteScratchBoard({ id, userId }: DeleteScratchBoardRequestDto) {
		const existingResource = await this._getExistingByIdOrFail(id, userId);
		return this.scratchBoardRepository.deleteById(existingResource.id);
	}

	async getAllScratchBoards({
		userId,
	}: GetAllScratchBoardsRequestDto): Promise<GetAllScratchBoardsResponseDto> {
		const scratchBoards =
			await this.scratchBoardRepository.getAllByUserId(userId);

		return {
			scratchBoards: scratchBoards.map(
				({ id, name, userId }) =>
					new GetAllScratchBoardsResponseDtoItem(id, name, userId),
			),
		};
	}

	async getScratchBoardById({ id, userId }: GetScratchBoardByIdRequestDto) {
		return this._getExistingByIdOrFail(id, userId);
	}

	async updateScratchBoard({
		id,
		userId,

		content,
		name,
	}: UpdateScratchBoardRequestDto) {
		const existingEntry = await this._getExistingByIdOrFail(id, userId);

		const updatedEntry = new ScratchBoard({
			id: existingEntry.id,
			userId: existingEntry.userId,
			content: content === undefined ? existingEntry.content : content,
			name: name === undefined ? existingEntry.name : name,
		});

		const newEntry = await this.scratchBoardRepository.updateById(
			id,
			updatedEntry,
		);

		return {
			id: newEntry.id,
		};
	}

	async _getExistingByIdOrFail(
		id: string,
		userId: string,
	): Promise<ScratchBoard> {
		const notFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Scratch board with id ${id} not found`,
		);

		const existingEntry = await this.scratchBoardRepository.getById(id);

		if (!existingEntry) throw notFoundError;
		if (existingEntry.userId !== userId) throw notFoundError;

		return existingEntry;
	}
}
