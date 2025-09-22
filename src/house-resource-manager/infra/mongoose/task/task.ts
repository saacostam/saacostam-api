import { model, Schema } from "mongoose";
import { CalendarDateSchema } from "../calendar-date";

// Cadence
const BaseCadenceSchema = new Schema(
	{
		type: {
			type: String,
			required: true,
			enum: [
				"one-time",
				"daily",
				"weekly",
				"monthly-by-day",
				"monthly-by-weekday",
				"yearly-by-day",
				"time-based-recurrence",
			],
		},
	},
	{ _id: false, discriminatorKey: "type" },
);

const OneTimeCadenceSchema = new Schema({}, { _id: false });
const DailyCadenceSchema = new Schema({}, { _id: false });
const WeeklyCadenceSchema = new Schema(
	{ dayOfTheWeek: { type: Number, required: true } },
	{ _id: false },
);
const MonthlyByDayCadenceSchema = new Schema(
	{ dayOfTheMonth: { type: Number, required: true } },
	{ _id: false },
);
const MonthlyByWeekdayCadenceSchema = new Schema(
	{
		weekOfTheMonth: { type: Number, required: true },
		dayOfTheWeek: { type: Number, required: true },
	},
	{ _id: false },
);
const YearlyByDayCadenceSchema = new Schema({}, { _id: false });
const TimeBasedRecurrenceCadenceSchema = new Schema(
	{
		timeFrame: { type: String, required: true, enum: ["day", "week", "month"] },
		amount: { type: Number, required: true },
	},
	{ _id: false },
);

BaseCadenceSchema.discriminator("one-time", OneTimeCadenceSchema);
BaseCadenceSchema.discriminator("daily", DailyCadenceSchema);
BaseCadenceSchema.discriminator("weekly", WeeklyCadenceSchema);
BaseCadenceSchema.discriminator("monthly-by-day", MonthlyByDayCadenceSchema);
BaseCadenceSchema.discriminator(
	"monthly-by-weekday",
	MonthlyByWeekdayCadenceSchema,
);
BaseCadenceSchema.discriminator("yearly-by-day", YearlyByDayCadenceSchema);
BaseCadenceSchema.discriminator(
	"time-based-recurrence",
	TimeBasedRecurrenceCadenceSchema,
);

// Task
export const TaskSchema = new Schema(
	{
		_id: { type: String, required: true },
		name: { type: String, required: true },
		description: {
			type: String,
			require: false,
			default: null,
		},
		resourcesIds: {
			type: [String],
			default: null,
		},
		categoryId: {
			type: String,
			require: false,
			default: null,
		},
		cadence: {
			type: BaseCadenceSchema,
			required: true,
		},
		userId: { type: String, required: true },
		anchorDate: {
			type: CalendarDateSchema,
			required: true,
		},
	},
	{ _id: false },
);

export const TaskModel = model("Task", TaskSchema);
