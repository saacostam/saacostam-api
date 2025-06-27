import {z} from "zod";

const createValidator = z.object({
  name: z.string().min(1).max(24),
  description: z.string().max(255).optional(),
});

export const CategoryValidator = {
    createValidator,
}
