import { z } from "zod";

// --- Cadence Validator ---
const cadenceOneTime = z.object({
	type: z.literal("one-time"),
});

const cadenceDaily = z.object({
	type: z.literal("daily"),
});

const cadenceWeekly = z.object({
	type: z.literal("weekly"),
	dayOfTheWeek: z.number().int().min(0).max(6),
});

const cadenceMonthlyByDay = z.object({
	type: z.literal("monthly-by-day"),
	dayOfTheMonth: z.number().int().min(1).max(31),
});

const cadenceMonthlyByWeekday = z.object({
	type: z.literal("monthly-by-weekday"),
	weekOfTheMonth: z.number().int().min(1).max(5),
	dayOfTheWeek: z.number().int().min(0).max(6),
});

const cadenceYearlyByDay = z.object({
	type: z.literal("yearly-by-day"),
	dayOfTheYear: z.number().int().min(1).max(366),
});

const cadenceTimeBased = z.object({
	type: z.literal("time-based-recurrence"),
	timeFrame: z.enum(["day", "week", "month"]),
	amount: z.number().int().min(1),
});

const cadenceField = z.discriminatedUnion("type", [
	cadenceOneTime,
	cadenceDaily,
	cadenceWeekly,
	cadenceMonthlyByDay,
	cadenceMonthlyByWeekday,
	cadenceYearlyByDay,
	cadenceTimeBased,
]);

// --- Reusable Fields ---
const nameField = z.string().min(1).max(40);
const descriptionField = z.string().max(255).nullable();
const resourcesIdsField = z.array(z.string()).nullable();
const categoryIdField = z.string().nullable();
const anchorDateField = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected yyyy-mm-dd.");

// --- Validators ---

const createValidator = z.object({
	name: nameField,
	description: descriptionField,
	resourcesIds: resourcesIdsField,
	categoryId: categoryIdField,
	cadence: cadenceField,
	anchorDate: anchorDateField,
});

const updateValidator = z.object({
	name: nameField.optional(),
	description: descriptionField.optional(),
	resourcesIds: resourcesIdsField.optional(),
	categoryId: categoryIdField.optional(),
	cadence: cadenceField.optional(),
	anchorDate: anchorDateField.optional(),
});

export const TaskValidator = {
	createValidator,
	updateValidator,
	cadenceField,
};
