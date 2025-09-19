import type { InferSchemaType } from "mongoose";
import type { UserRepository } from "../../app/repositories";
import { User, UserWithHash } from "../../domain/entities";
import type { Timezone } from "../../domain/value-objects";
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
