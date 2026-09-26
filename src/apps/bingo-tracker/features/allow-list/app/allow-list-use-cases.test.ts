import { beforeEach, describe, expect, it } from "vitest";
import { mockDiContext } from "@/apps/bingo-tracker/shared/di/test";
import { AllowListUseCases } from "./allow-list-use-cases";

describe("AllowListUseCases", () => {
	let ctx: ReturnType<typeof mockDiContext>;
	let useCases: AllowListUseCases;

	beforeEach(() => {
		ctx = mockDiContext();
		useCases = new AllowListUseCases(ctx);
	});

	it("returns the user's capabilities", async () => {
		ctx.repo.allowList.isAllowedToUseVision.mockResolvedValue(true);

		const result = await useCases.getCapabilities({
			userId: "user-1",
		});

		expect(result).toEqual({
			vision: true,
		});

		expect(ctx.repo.allowList.isAllowedToUseVision).toHaveBeenCalledTimes(1);

		expect(ctx.repo.allowList.isAllowedToUseVision).toHaveBeenCalledWith(
			"user-1",
		);
	});

	it("returns vision as disabled when the allow-list repository fails", async () => {
		ctx.repo.allowList.isAllowedToUseVision.mockRejectedValue(
			new Error("Database unavailable"),
		);

		const result = await useCases.getCapabilities({
			userId: "user-1",
		});

		expect(result).toEqual({
			vision: false,
		});

		expect(ctx.repo.allowList.isAllowedToUseVision).toHaveBeenCalledWith(
			"user-1",
		);
	});
});
