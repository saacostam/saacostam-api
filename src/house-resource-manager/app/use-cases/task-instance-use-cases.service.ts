import { generateId } from "../../../core.utils";
import { type Task, TaskCompletion } from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import { CalendarDate } from "../../domain/value-objects";
import type {
	CreateTaskInstanceCompletionDto,
	DeleteTaskInstanceCompletionDto,
	GetAllTaskInstancesAppResponse,
	GetAllTaskInstancesDto,
} from "../dtos";
import type { TaskCompletionRepository, TaskRepository } from "../repositories";

const DAYS_IN_A_WEEK = 7;
const DAYS_IN_A_YEAR = 365;
const MAX_DAYS_IN_A_MONTH = 31;

export class TaskInstanceUseCases {
	constructor(
		private taskRepository: TaskRepository,
		private taskCompletionRepository: TaskCompletionRepository,
	) {}

	async getAllTaskInstances({ userId }: GetAllTaskInstancesDto) {
		const tasks = await this.taskRepository.getAllByUserId(userId);
		const taskCompletions =
			await this.taskCompletionRepository.getAllByUserId(userId);

		const taskInstances: GetAllTaskInstancesAppResponse = [];
		for (const task of tasks) {
			// Get Last Completion (if possible), and send it as a history of what has been done.
			const lastCompletion = this._getLastCompletion({
				task,
				taskCompletions,
			});
			if (lastCompletion) {
				taskInstances.push({
					status: {
						type: "committed",
						id: lastCompletion.id,
					},
					date: lastCompletion.date,
					task,
				});
			}

			const nextInstance = this._computeNextInstance({
				task,
				taskCompletions,
			});

			if (nextInstance) taskInstances.push(nextInstance);
		}

		return taskInstances.map((ti) => ({
			...ti,
			date: ti.date.getISO8601String(),
		}));
	}

	async createTaskInstanceCompletion({
		date: rawDateIsoString,
		taskId,
		userId,
	}: CreateTaskInstanceCompletionDto) {
		const existingTask = await this._getTaskById(taskId, userId);

		// Cast raw date-iso-string to value-object
		let date: CalendarDate;
		try {
			date = CalendarDate.fromISO8601(rawDateIsoString);
		} catch {
			throw new BaseDomainError(
				DomainErrorType.BAD_REQUEST,
				"Invalid Date Format",
				[
					{
						field: "date",
						message: "Invalid Date Format",
					},
				],
			);
		}

		const taskCompletion = new TaskCompletion(
			generateId(),
			existingTask.id,
			date,
			userId,
		);

		const newTaskCompletion =
			await this.taskCompletionRepository.create(taskCompletion);
		return {
			id: newTaskCompletion.id,
		};
	}

	async deleteTaskInstanceCompletion({
		id,
		userId,
	}: DeleteTaskInstanceCompletionDto): Promise<void> {
		const existingTaskCompletion = await this._getTaskCompletionById(
			id,
			userId,
		);
		return this.taskCompletionRepository.deleteById(existingTaskCompletion.id);
	}

	_computeNextInstance(args: {
		task: Task;
		taskCompletions: TaskCompletion[];
	}): GetAllTaskInstancesAppResponse[0] | null {
		// SANITIZE INPUT: Filter completions to only those relevant to the current task
		const { task, taskCompletions: _taskCompletions } = args;
		const taskCompletions = _taskCompletions.filter(
			(tc) => tc.taskId === task.id,
		);

		// GET LAST-COMPLETION FOR THE TASK
		// Check if there are any recorded completions for this task and use the latest one
		const latestTaskCompletion = this._getLastCompletion({
			task,
			taskCompletions,
		});
		const latestTaskCompletionDate = latestTaskCompletion?.date;

		// EARLY RETURN FOR TIME-BASED-RECURRENCE
		// Handled differently because it's computed from the last occurrence,
		// and doesn't require finding a day that matches a specific condition.
		if (task.cadence.type === "time-based-recurrence") {
			// For invalid dates (e.g., Feb 29 on a non-leap year),
			// it's assumed CalendarDate's add method will handle rollovers correctly.

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

			// The next instance is the last completion date plus the recurrence interval.
			// If no completion date exists, return the anchor date.
			const expectedDate = latestTaskCompletionDate
				? latestTaskCompletionDate.add(addPayload)
				: task.anchorDate;

			return {
				status: {
					type: "virtual",
				},
				task,
				date: expectedDate,
			};
		}

		// HANDLE OTHER TYPES - COMPUTE LAST COMPLETION
		// Initialize lastCompletion to the day before the task's anchor date.
		// This ensures that if no completions exist, the anchor date itself can be the first calculated instance.
		let lastCompletion: CalendarDate = task.anchorDate.add({ days: -1 });

		// If a latest completion exists AND it is more recent than our initial lastCompletion (anchorDate - 1 day),
		// then use the actual latest completion date as the reference point.
		if (latestTaskCompletionDate?.moreThan(lastCompletion)) {
			lastCompletion = latestTaskCompletionDate;
		}

		// GET ANCHOR DATES (e.g., today's date)
		const { today } = CalendarDate.anchorDates();

		// COMPUTE THE NEXT OCCURRENCE based on the task's cadence type
		switch (task.cadence.type) {
			case "one-time": {
				const expectedDate = task.anchorDate;

				// If the last completion date matches the expected one-time date,
				// it means the task has already been completed, so return null.
				return lastCompletion.equals(expectedDate)
					? null
					: {
							status: {
								type: "virtual",
							},
							task: task,
							date: expectedDate,
						};
			}
			case "daily": {
				const expectedDate = today;

				// If the task was completed on today's date, schedule it for tomorrow.
				// Otherwise (if not completed today or completed before today), schedule for today.
				const wasDoneToday = lastCompletion.equals(expectedDate);
				const delta = wasDoneToday ? 1 : 0;

				return {
					status: {
						type: "virtual",
					},
					task,
					date: expectedDate.add({
						days: delta,
					}),
				};
			}
			case "weekly": {
				// Initialize expectedDate. The loop will find the next instance.
				// The loop checks days starting from 1 day *after* lastCompletion.
				let expectedDate = lastCompletion;

				// Loop a bit more than a week to ensure the next instance is found,
				// even if the lastCompletion was just after the target day in the previous week.
				for (let dx = 1; dx <= DAYS_IN_A_WEEK + 1; dx++) {
					const dxDaysAfter = lastCompletion.clone().add({
						days: dx,
					});

					if (dxDaysAfter.getDayOfWeek() === task.cadence.dayOfTheWeek) {
						expectedDate = dxDaysAfter;
						break;
					}
				}

				return {
					status: {
						type: "virtual",
					},
					task,
					date: expectedDate,
				};
			}
			case "monthly-by-day": {
				// Initialize expectedDate. The loop will find the next instance.
				let expectedDate = lastCompletion;

				// Loop a bit more than a month to ensure the next instance is found,
				// even if lastCompletion was just after the target day in the previous month.
				for (let dx = 1; dx <= MAX_DAYS_IN_A_MONTH + 1; dx++) {
					const dxDaysAfter = lastCompletion.clone().add({
						days: dx,
					});

					// DYNAMIC CLAMPING: Calculate the clamped day for *this specific month*
					// This ensures that "day 31" correctly becomes "day 28/29/30" for shorter months being checked.
					const daysInThisMonth = CalendarDate.getDaysInMonth(
						dxDaysAfter.getYear(),
						dxDaysAfter.getMonth(),
					);
					const clampedDayOfTheMonth = Math.min(
						task.cadence.dayOfTheMonth, // User's desired day (e.g., 31)
						daysInThisMonth, // Actual days in the month being checked (e.g., 28 for Feb)
					);

					if (dxDaysAfter.getDay() === clampedDayOfTheMonth) {
						expectedDate = dxDaysAfter;
						break;
					}
				}

				return {
					status: {
						type: "virtual",
					},
					task,
					date: expectedDate,
				};
			}
			case "monthly-by-weekday": {
				// Store original values as they are needed for matching and dynamic clamping
				const originalDayOfTheWeek = task.cadence.dayOfTheWeek;
				const originalWeekOfTheMonth = task.cadence.weekOfTheMonth;

				// Initialize expectedDate. The loop will find the next instance.
				let expectedDate = lastCompletion;

				// Loop a bit more than a month to ensure the next instance is found.
				for (let dx = 1; dx <= MAX_DAYS_IN_A_MONTH + 1; dx++) {
					const dxDaysAfter = lastCompletion.clone().add({
						days: dx,
					});

					// DYNAMIC CLAMPING: Calculate the clamped week of the month for *this specific month*
					// This handles cases where a month might not have a 5th Monday, etc.
					const amountOfWeeksInThisMonth = CalendarDate.getWeekdayOccurrences(
						dxDaysAfter.getYear(),
						dxDaysAfter.getMonth(),
						originalDayOfTheWeek,
					);
					const clampedWeekOfTheMonth = Math.min(
						originalWeekOfTheMonth, // User's desired week (e.g., 5)
						amountOfWeeksInThisMonth, // Actual occurrences in the month being checked (e.g., 4)
					);

					if (
						dxDaysAfter.getWeekOfMonth() === clampedWeekOfTheMonth &&
						dxDaysAfter.getDayOfWeek() === originalDayOfTheWeek
					) {
						expectedDate = dxDaysAfter;
						break;
					}
				}

				return {
					status: {
						type: "virtual",
					},
					task,
					date: expectedDate,
				};
			}
			case "yearly-by-day": {
				const targetMonth = task.anchorDate.getMonth();
				const targetDay = task.anchorDate.getDay();

				// Initialize expectedDate. The loop will find the next instance.
				let expectedDate = lastCompletion;

				// Iterate forward day-by-day until we find the next valid instance.
				// Loop a bit more than a year to ensure the next instance is found.
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

				return {
					status: {
						type: "virtual",
					},
					task,
					date: expectedDate,
				};
			}
		}
	}

	_getLastCompletion(args: {
		task: Task;
		taskCompletions: TaskCompletion[];
	}): TaskCompletion | undefined {
		// SANITIZE INPUT: Filter completions to only those relevant to the current task
		const { task, taskCompletions: _taskCompletions } = args;
		const taskCompletions = _taskCompletions.filter(
			(tc) => tc.taskId === task.id,
		);

		// GET LAST-COMPLETION FOR THE TASK
		// Check if there are any recorded completions for this task and use the latest one
		const latestTaskCompletion = taskCompletions.reduce(
			(latest: TaskCompletion | undefined, tc) => {
				if (!latest || tc.date.moreThan(latest.date)) {
					return tc;
				}
				return latest;
			},
			undefined,
		);

		return latestTaskCompletion;
	}

	async _getTaskById(id: string, userId: string): Promise<Task> {
		const notFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Task with id ${id} not found`,
		);

		const existingTask = await this.taskRepository.getById(id);

		if (!existingTask) throw notFoundError;
		if (existingTask.userId !== userId) throw notFoundError;

		return existingTask;
	}

	async _getTaskCompletionById(
		id: string,
		userId: string,
	): Promise<TaskCompletion> {
		const notFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Task completion with id ${id} not found`,
		);

		const existingTaskCompletion =
			await this.taskCompletionRepository.getById(id);

		if (!existingTaskCompletion) throw notFoundError;
		if (existingTaskCompletion.userId !== userId) throw notFoundError;

		return existingTaskCompletion;
	}
}
