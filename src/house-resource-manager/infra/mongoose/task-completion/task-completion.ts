import { model, Schema } from "mongoose";

export const TaskCompletionSchema = new Schema(
	{
		_id: { type: String, required: true },
		taskId: { type: String, required: true },
		date: { type: String, required: true },
		userId: { type: String, required: true },
	},
	{ _id: false },
);

export const TaskCompletionModel = model(
	"TaskCompletion",
	TaskCompletionSchema,
);
