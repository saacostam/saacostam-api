import type { User } from "@/apps/bingo-tracker/features/user/domain";

export interface AllowListRepository {
	isAllowedToUseVision(userId: User["id"]): Promise<boolean>;
}
