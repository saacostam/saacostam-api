import type OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import type {
	VisionProvider,
	VisionProviderPayload,
} from "@/apps/bingo-tracker/shared/adapters/domain";

const BoardValuesSchema = z.object({
	values: z.array(z.array(z.number().int().nonnegative().optional())),
});

export class OpenAiVisionProvider implements VisionProvider {
	constructor(private readonly client: OpenAI) {}

	async extractBoard({
		boardTemplate,
		image,
	}: VisionProviderPayload["extractBoard"]["req"]): Promise<
		VisionProviderPayload["extractBoard"]["res"]
	> {
		const imageUrl = `data:${image.mimeType};base64,${image.data.toString("base64")}`;

		const response = await this.client.responses.parse({
			model: "gpt-5.5",
			input: [
				{
					role: "user",
					content: [
						{
							type: "input_text",
							text: [
								"Extract the bingo board from the provided image.",
								"",
								"Board template:",
								JSON.stringify(boardTemplate),
								"",
								"Rules:",
								"- Preserve the exact number of rows and columns from the template.",
								"- Extract the number from each visible cell.",
								"- If a cell is empty or no number can be identified, return null.",
								"- Do not invent or infer numbers.",
								"- Return only the board values.",
							].join("\n"),
						},
						{
							type: "input_image",
							image_url: imageUrl,
							detail: "high",
						},
					],
				},
			],
			text: {
				format: zodTextFormat(BoardValuesSchema, "bingo_board_values"),
			},
		});

		if (!response.output_parsed) {
			throw new Error("OpenAI did not return board values");
		}

		return {
			board: response.output_parsed.values.map((row) =>
				row.map((value) => value ?? undefined),
			),
		};
	}
}
