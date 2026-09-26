import type { Collection } from "mongodb";
import type { AllowListRepository } from "@/apps/bingo-tracker/features/allow-list/domain";
import type { User } from "@/apps/bingo-tracker/features/user/domain";
import { bingoTrackingDb } from "@/apps/bingo-tracker/shared/mongo";

interface AllowListDocument {
	_id: string;
	userIds: User["id"][];
}

const allowListCollection: Collection<AllowListDocument> =
	bingoTrackingDb.collection("allow-list");

export class MongoAllowListRepository implements AllowListRepository {
	async isAllowedToUseVision(userId: User["id"]): Promise<boolean> {
		const allowList = await allowListCollection.findOne({
			_id: "vision",
		});

		if (allowList === null) {
			return false;
		}

		return allowList.userIds.includes(userId);
	}
}
