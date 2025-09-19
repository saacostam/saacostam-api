import { Schema } from "mongoose";

export const CalendarDateSchema = new Schema(
	{
		_date: { type: Date, required: true },
		timezone: { type: String, required: true },
	},
	{ _id: false },
);
