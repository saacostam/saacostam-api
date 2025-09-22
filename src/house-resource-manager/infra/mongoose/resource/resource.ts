import { model, Schema } from "mongoose";

export const ResourceSchema = new Schema(
	{
		_id: { type: String, required: true },
		name: { type: String, required: true },
		description: {
			type: String,
			require: false,
			default: null,
		},
		status: {
			type: String,
			required: true,
			enum: ["active", "archived"],
		},
		creationDate: { type: Date, required: true },
		updateDate: { type: Date, required: true },
		categoryId: {
			type: String,
			require: false,
			default: null,
		},
		quantity: { type: Number, required: true },
		userId: { type: String, required: true },
	},
	{ _id: false },
);

export const ResourceModel = model("Resource", ResourceSchema);
