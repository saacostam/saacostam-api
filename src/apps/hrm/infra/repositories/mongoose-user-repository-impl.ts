import type { InferSchemaType } from "mongoose";
import type { UserRepository } from "@/apps/hrm/app";
import { type Timezone, User, UserWithHash } from "@/apps/hrm/domain";
import { BaseDomainError, DomainErrorType } from "@/shared/errors/domain";
import { UserModel, type UserSchema } from "../mongoose";

export class MongooseUserRepositoryImpl implements UserRepository {
	async create(user: UserWithHash): Promise<User> {
		const entry = await UserModel.create({ ...user, _id: user.id });
		return this._mapDocumentEntryToDomainObject(entry);
	}

	async getById(id: string): Promise<User | undefined> {
		const user = await UserModel.findById(id);
		return user ? this._mapDocumentEntryToDomainObject(user) : undefined;
	}

	async getUserWithHashByUsername(
		username: string,
	): Promise<UserWithHash | undefined> {
		const user = await UserModel.findOne({ username });

		return user
			? this._mapDocumentEntryToDomainObjectWithHash(user)
			: undefined;
	}

	async filterByUsername(username: string): Promise<User[]> {
		const users = await UserModel.find({ username });
		return users.map(this._mapDocumentEntryToDomainObject);
	}

	async updateById(id: string, user: User): Promise<User> {
		const updatedUser = await UserModel.findByIdAndUpdate(id, {
			...user,
			_id: user.id,
		});

		if (!updatedUser) {
			throw new BaseDomainError({
				type: DomainErrorType.SERVER_ERROR,
				message:
					"[MongooseUserRepositoryImpl.updateById] - Unable to update user: no user found with the provided id",
				userMessage: "User not found",
			});
		}

		return this._mapDocumentEntryToDomainObject(updatedUser);
	}

	_mapDocumentEntryToDomainObject(
		documentEntry: InferSchemaType<typeof UserSchema>,
	): User {
		return new User(
			documentEntry._id,
			documentEntry.username,
			documentEntry.firstName,
			documentEntry.lastName,
			documentEntry.timezone as Timezone,
		);
	}

	_mapDocumentEntryToDomainObjectWithHash(
		documentEntry: InferSchemaType<typeof UserSchema>,
	): UserWithHash {
		return new UserWithHash(
			documentEntry._id,
			documentEntry.username,
			documentEntry.firstName,
			documentEntry.lastName,
			documentEntry.passwordHash,
			documentEntry.timezone as Timezone,
		);
	}
}
