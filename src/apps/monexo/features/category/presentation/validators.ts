import { z } from "zod";

const descriptionField = z.string().min(0).max(500).nullable().optional();
const nameField = z
	.string()
	.min(1, "Required")
	.max(30, "Max 30 characters allowed");

const createCategory = z.object({
	description: descriptionField,
	name: nameField,
});

const updateCategory = z.object({
	description: descriptionField.optional(),
	name: nameField.optional(),
});

export const CategoryValidator = {
	createCategory,
	updateCategory,
};
