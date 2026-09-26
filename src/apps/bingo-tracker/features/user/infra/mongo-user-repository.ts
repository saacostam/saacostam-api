import type { Collection } from "mongodb";
import type {
	User,
	UserRepository,
	UserWithPwHash,
} from "@/apps/bingo-tracker/features/user/domain";
import { bingoTrackingDb } from "@/apps/bingo-tracker/shared/mongo";

interface UserDocument {
	_id: string;
	username: string;
	passwordHash: string;
}

const usersCollection: Collection<UserDocument> =
	bingoTrackingDb.collection("users");

export class MongoUserRepository implements UserRepository {
	async create(user: UserWithPwHash): Promise<User> {
		await usersCollection.insertOne({
			_id: user.id,
			username: user.username,
			passwordHash: user.passwordHash,
		});

		return {
			id: user.id,
			username: user.username,
		};
	}

	async getById(id: string): Promise<User | null> {
		const user = await usersCollection.findOne({
			_id: id,
		});

		if (user === null) {
			return null;
		}

		return this.mapToUser(user);
	}

	async getUserWithHashByUsername(
		username: string,
	): Promise<UserWithPwHash | null> {
		const user = await usersCollection.findOne({
			username,
		});

		if (user === null) {
			return null;
		}

		return this.mapToUserWithHash(user);
	}

	async filterByUsername(username: string): Promise<User[]> {
		const users = await usersCollection
			.find({
				username,
			})
			.toArray();

		return users.map(this.mapToUser);
	}

	private mapToUser(user: UserDocument): User {
		return {
			id: user._id,
			username: user.username,
		};
	}

	private mapToUserWithHash(user: UserDocument): UserWithPwHash {
		return {
			id: user._id,
			username: user.username,
			passwordHash: user.passwordHash,
		};
	}
}
