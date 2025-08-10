import {
	type Task,
	type TaskCompletion,
	TaskInstance,
} from "../../domain/entities";
import { CalendarDate } from "../../domain/value-objects";
import type { GetAllTaskInstancesDto } from "../dtos";
import type { TaskCompletionRepository, TaskRepository } from "../repositories";

const DAYS_IN_A_WEEK = 7;
const DAYS_IN_A_YEAR = 365;
const MIN_DAYS_IN_A_MONTH = 28;
const MAX_DAYS_IN_A_MONTH = 31;

export class TaskInstanceUseCases {
	constructor(
		private taskRepository: TaskRepository,
		private taskCompletionRepository: TaskCompletionRepository,
	) {}

	async getAllTaskInstances({
		userId,
	}: GetAllTaskInstancesDto): Promise<TaskInstance[]> {
		const tasks = await this.taskRepository.getAllByUserId(userId);
		const taskCompletions =
			await this.taskCompletionRepository.getAllByUserId(userId);

		const taskInstances: TaskInstance[] = [];
		for (const task of tasks) {
			const nextInstance = this._computeNextInstance({
				task,
				taskCompletions,
			});

			if (nextInstance) taskInstances.push(nextInstance);
		}

		return taskInstances;
	}

	_computeNextInstance(args: {
		task: Task;
		taskCompletions: TaskCompletion[];
	}): TaskInstance | null {
		// SANITIZE INPUT
		const { task, taskCompletions: _taskCompletions } = args;
		const taskCompletions = _taskCompletions.filter(
			(tc) => tc.taskId === task.id,
		);

		// GET LAST-COMPLETION FOR THE TASK
		// Assume the previous date for the anchor-date
		let lastCompletion: CalendarDate = task.anchorDate.add({ days: -1 });

		// Check that a task completion EXIST and is in the FUTURE
		const lastCompletionBasedOnPreviousTaskCompletions = taskCompletions.reduce(
			(latest: CalendarDate | undefined, tc) => {
				if (!latest || tc.date.moreThan(latest)) {
					return tc.date;
				}
				return latest;
			},
			undefined,
		);
		if (
			lastCompletionBasedOnPreviousTaskCompletions &&
			lastCompletionBasedOnPreviousTaskCompletions.moreThan(lastCompletion)
		) {
			lastCompletion = lastCompletionBasedOnPreviousTaskCompletions;
		}

		// GET ANCHOR DATES
		const { today } = CalendarDate.anchorDates();

		// COMPUTE THE NEXT OCURRENCE
		switch (task.cadence.type) {
			case "one-time": {
				const expectedDate = task.anchorDate;

				return lastCompletion.equals(expectedDate)
					? null
					: new TaskInstance(task.id, expectedDate);
			}
			case "daily": {
				const expectedDate = today;

				// If it was done today, schedule for tomorrow, if not today
				const wasDoneToday = lastCompletion.equals(expectedDate);
				const delta = wasDoneToday ? 1 : 0;

				return new TaskInstance(
					task.id,
					expectedDate.add({
						days: delta,
					}),
				);
			}
			case "weekly": {
				// NOTE: Initialized with this value to avoid compiler issues.
				// As we iterate through more than a week’s worth of days,
				// this value will inevitably shift to the next week’s instance.
				//
				// IMPORTANT: Simply adding +DAYS_IN_A_WEEK is not sufficient,
				// since the anchor date itself can be modified to a value in-between.

				let expectedDate = lastCompletion;
				for (let dx = 1; dx <= DAYS_IN_A_WEEK + 1; dx++) {
					const dxDaysAfter = lastCompletion.clone().add({
						days: dx,
					});

					if (dxDaysAfter.getDayOfWeek() === task.cadence.dayOfTheWeek) {
						expectedDate = dxDaysAfter;
						break;
					}
				}

				return new TaskInstance(task.id, expectedDate);
			}
			case "monthly-by-day": {
				// CLAMP TASK CONFIGURATION BASED ON MONTH LIMITS
				const anyDayNextMonth = lastCompletion.add({
					days: MIN_DAYS_IN_A_MONTH,
				});

				// Amount of days next month can vary.
				// Therefore we need to clamp that value
				const amountOfDaysNextMonth = CalendarDate.getDaysInMonth(
					anyDayNextMonth.getYear(),
					anyDayNextMonth.getMonth(),
				);

				const dayOfTheMonth = Math.min(
					task.cadence.dayOfTheMonth,
					amountOfDaysNextMonth,
				);

				// NOTE: Initialized with this value to avoid compiler issues.
				// As we iterate through more than a months’s worth of days,
				// this value will inevitably shift to the next months’s instance.
				//
				// IMPORTANT: Simply adding 1 month is not sufficient,
				// since the anchor date itself can be modified to a value in-between.

				let expectedDate = lastCompletion;
				for (let dx = 1; dx <= MAX_DAYS_IN_A_MONTH + 1; dx++) {
					const dxDaysAfter = lastCompletion.clone().add({
						days: dx,
					});

					if (dxDaysAfter.getDay() === dayOfTheMonth) {
						expectedDate = dxDaysAfter;
						break;
					}
				}

				return new TaskInstance(task.id, expectedDate);
			}
			case "monthly-by-weekday": {
				// CLAMP TASK CONFIGURATION BASED ON MONTH LIMITS
				const anyDayNextMonth = lastCompletion.add({
					days: MIN_DAYS_IN_A_MONTH,
				});

				// Amount of weeks next month can vary.
				// The user can add 5, but
				//  - Some months have only 4 weeks.
				//  - Some instances of a day (ex: Monday) might happen only 4 weeks.
				// Therefore we need to clamp that value
				const amountOfWeeksNextMonth = CalendarDate.getWeekdayOccurrences(
					anyDayNextMonth.getYear(),
					anyDayNextMonth.getMonth(),
					task.cadence.dayOfTheWeek,
				);
				const weekOfTheMonth = Math.min(
					task.cadence.weekOfTheMonth,
					amountOfWeeksNextMonth,
				);

				const dayOfTheWeek = task.cadence.dayOfTheWeek;

				// NOTE: Initialized with this value to avoid compiler issues.
				// As we iterate through more than a months’s worth of days,
				// this value will inevitably shift to the next months’s instance.
				//
				// IMPORTANT: Simply adding 1 month is not sufficient,
				// since the anchor date itself can be modified to a value in-between.

				let expectedDate = lastCompletion;
				for (let dx = 1; dx <= MAX_DAYS_IN_A_MONTH + 1; dx++) {
					const dxDaysAfter = lastCompletion.clone().add({
						days: dx,
					});

					if (
						dxDaysAfter.getWeekOfMonth() === weekOfTheMonth &&
						dxDaysAfter.getDayOfWeek() === dayOfTheWeek
					) {
						expectedDate = dxDaysAfter;
						break;
					}
				}

				return new TaskInstance(task.id, expectedDate);
			}
			case "yearly-by-day": {
				const targetMonth = task.anchorDate.getMonth();
				const targetDay = task.anchorDate.getDay();

				// Iterate forward day-by-day until we find the next valid instance
				let expectedDate = lastCompletion;
				for (let dx = 1; dx <= DAYS_IN_A_YEAR + 1; dx++) {
					const dxDaysAfter = lastCompletion.clone().add({ days: dx });
					if (
						dxDaysAfter.getMonth() === targetMonth &&
						dxDaysAfter.getDay() === targetDay
					) {
						expectedDate = dxDaysAfter;
						break;
					}
				}

				return new TaskInstance(task.id, expectedDate);
			}
			case "time-based-recurrence": {
				// NOTE: For invalid dates (e.g., Feb 29 on a non-leap year)
				// JS automatically rolls over to the next valid day.

				const amount = task.cadence.amount;

				let addPayload: Parameters<CalendarDate["add"]>[0];
				switch (task.cadence.timeFrame) {
					case "day":
						addPayload = { days: amount };
						break;
					case "month":
						addPayload = { months: amount };
						break;
					case "week":
						addPayload = { weeks: amount };
						break;
				}

				const expectedDate = lastCompletion.add(addPayload);

				return new TaskInstance(task.id, expectedDate);
			}
		}
	}
}
