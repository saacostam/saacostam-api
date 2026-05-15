import type {
	IUser,
	IUserRepository,
	IUserWithHash,
} from "@/apps/monexo/features/user/domain";
import { monexoDb } from "@/apps/monexo/shared/mongo";

interface UserDocument {
	_id: string;
	username: string;
	passwordHash: string;
}

const usersCollection = monexoDb.collection<UserDocument>("users");

export class MongoUserRepository implements IUserRepository {
	async create(user: IUserWithHash): Promise<IUser> {
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

	async getById(id: string): Promise<IUser | null> {
		const user = await usersCollection.findOne({
			_id: id,
		});

		if (user === null) return null;

		return {
			id: user._id,
			username: user.username,
		};
	}

	async getUserWithHashByUsername(
		username: string,
	): Promise<IUserWithHash | null> {
		const user = await usersCollection.findOne({
			username,
		});

		if (user === null) return null;

		return {
			id: user._id,
			username: user.username,
			passwordHash: user.passwordHash,
		};
	}

	async filterByUsername(username: string): Promise<IUser[]> {
		const users = await usersCollection
			.find({
				username,
			})
			.toArray();

		return users.map((user) => ({
			id: user._id,
			username: user.username,
		}));
	}
}
