import { model, Schema } from "mongoose";

export const UserSchema = new Schema(
	{
		_id: { type: String, required: true },
		username: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		passwordHash: { type: String, required: true },
		timezone: { type: String, required: true },
	},
	{ _id: false },
);

export const UserModel = model("User", UserSchema);
