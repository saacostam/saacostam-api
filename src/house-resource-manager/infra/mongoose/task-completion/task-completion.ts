import { model, Schema } from "mongoose";
import { CalendarDateSchema } from "../calendar-date";

export const TaskCompletionSchema = new Schema(
	{
		_id: { type: String, required: true },
		taskId: { type: String, required: true },
		date: { type: CalendarDateSchema, required: true },
		userId: { type: String, required: true },
	},
	{ _id: false },
);

export const TaskCompletionModel = model(
	"TaskCompletion",
	TaskCompletionSchema,
);
