import type { Context } from "@/apps/bingo-tracker/shared/di/app";

export class AllowListUseCases {
	constructor(private ctx: Context) {}

	async getCapabilities({
		userId,
	}: AllowListUseCasesPayload["getCapabilities"]["req"]): Promise<
		AllowListUseCasesPayload["getCapabilities"]["res"]
	> {
		let canUseVision = false;

		try {
			canUseVision = await this.ctx.repo.allowList.isAllowedToUseVision(userId);
		} catch {
			// Defensive disablement: unavailable allow-list means no access.
		}

		return {
			vision: canUseVision,
		};
	}
}

export interface AllowListUseCasesPayload {
	getCapabilities: {
		req: {
			userId: string;
		};
		res: {
			vision: boolean;
		};
	};
}
