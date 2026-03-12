import { z } from "zod";

const taskIdField = z.string().min(1);
const dateField = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected yyyy-mm-dd.");

const createValidation = z.object({
	taskId: taskIdField,
	date: dateField,
});

export const TaskInstanceValidator = {
	createValidation,
};
