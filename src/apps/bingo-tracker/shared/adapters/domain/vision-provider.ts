import type { Board } from "@/apps/bingo-tracker/features/board/domain";

export interface VisionProvider {
	extractBoard(
		args: VisionProviderPayload["extractBoard"]["req"],
	): Promise<VisionProviderPayload["extractBoard"]["res"]>;
}

export interface VisionProviderPayload {
	extractBoard: {
		req: {
			image: File;
			description: string;
		};
		res: {
			board: Board["values"];
		};
	};
}
