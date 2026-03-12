import { model, Schema } from "mongoose";

export const CategorySchema = new Schema(
	{
		_id: { type: String, required: true },
		name: { type: String, required: true },
		description: {
			type: String,
			require: false,
			default: null,
		},
		userId: { type: String, required: true },
	},
	{ _id: false },
);

export const CategoryModel = model("Category", CategorySchema);
