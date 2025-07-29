import { z } from "zod";

const nameField = z.string().min(1).max(24);
const descriptionField = z.string().max(255).nullable();
const quantityField = z.number();
const categoryId = z.string().min(1).nullable();

const createValidator = z.object({
	name: nameField,
	description: descriptionField,
	quantity: quantityField,
	categoryId: categoryId,
});

const updateValidator = z.object({
	name: nameField.optional(),
	description: descriptionField.optional(),
	quantity: quantityField.optional(),
	categoryId: categoryId.optional(),
});

export const ResourceValidator = {
	createValidator,
	updateValidator,
};
