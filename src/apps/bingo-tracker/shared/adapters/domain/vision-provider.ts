import type { Board } from "@/apps/bingo-tracker/features/board/domain";
import type { ImageInput } from "@/apps/bingo-tracker/shared/types";

export interface VisionProvider {
	extractBoard(
		args: VisionProviderPayload["extractBoard"]["req"],
	): Promise<VisionProviderPayload["extractBoard"]["res"]>;
}

export interface VisionProviderPayload {
	extractBoard: {
		req: {
			image: ImageInput;
			description: string;
		};
		res: {
			board: Board["values"];
		};
	};
}
