import {z} from "zod";

const nameField = z.string().min(1).max(24); 
const descriptionField = z.string().max(255).nullable().optional();

const createValidator = z.object({
  name: nameField,
  description: descriptionField,
});

const updateValidator = z.object({
  name: nameField.optional(),
  description: descriptionField,
})

export const CategoryValidator = {
  createValidator,
  updateValidator,
}
