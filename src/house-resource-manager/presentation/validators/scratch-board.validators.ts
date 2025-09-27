import { z } from "zod";

const nameField = z.string().min(1).max(24);
const contentField = z.string().min(1).max(10_000);

const createValidator = z.object({
	name: nameField,
});

const updateValidator = z.object({
	name: nameField.optional(),
	content: contentField.optional(),
});

export const ScratchBoardValidator = {
	createValidator,
	updateValidator,
};
