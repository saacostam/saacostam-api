import { model, Schema } from "mongoose";

export const BoardSchema = new Schema(
	{
		_id: { type: String, required: true },
		name: { type: String, required: true },
		content: String,
		userId: { type: String, required: true },
	},
	{ _id: false },
);

export const BoardModel = model("Board", BoardSchema);
