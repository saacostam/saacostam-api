import type { InferSchemaType } from "mongoose";
import type { BoardRepository } from "../../app/repositories";
import { Board } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import { BoardModel, type BoardSchema } from "../mongoose/board";

export class MongooseBoardRepositoryImpl implements BoardRepository {
	async create(board: Board): Promise<Board> {
		const newBoard = await BoardModel.create({
			...board,
			_id: board.id,
		});
		return this._mapDocumentEntryToDomainObject(newBoard);
	}

	async deleteById(id: string): Promise<void> {
		await BoardModel.deleteOne({ _id: id });
	}

	async getAllByUserId(userId: string): Promise<Board[]> {
		const boards = await BoardModel.find({ userId });
		return boards.map(this._mapDocumentEntryToDomainObject);
	}

	async getById(id: string): Promise<Board | undefined> {
		const board = await BoardModel.findById(id);
		return board ? this._mapDocumentEntryToDomainObject(board) : undefined;
	}

	async updateById(id: string, board: Board): Promise<Board> {
		const updatedBoard = await BoardModel.findByIdAndUpdate(id, {
			...board,
			_id: board.id,
		});

		if (!updatedBoard) {
			throw new BaseDomainError(
				DomainErrorType.SERVER_ERROR,
				"[MongooseCategoryRepositoryImpl.updateById] - Unable to update category: no category found with the provided id",
			);
		}

		return this._mapDocumentEntryToDomainObject(updatedBoard);
	}

	_mapDocumentEntryToDomainObject(
		documentEntry: InferSchemaType<typeof BoardSchema>,
	): Board {
		return new Board({
			id: documentEntry._id,
			content: documentEntry.content ?? "",
			name: documentEntry.name,
			userId: documentEntry.userId,
		});
	}
}
