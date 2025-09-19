import { generateId } from "../../../core.utils";

import {
	type Category,
	type Resource,
	Task,
	type User,
} from "../../domain/entities";
import { BaseDomainError, DomainErrorType } from "../../domain/errors";
import { CalendarDate } from "../../domain/value-objects";
import type {
	CreateTaskRequestDto,
	DeleteTaskRequestDto,
	GetAllTasksRequestDto,
	GetTaskByIdRequestDto,
	UpdateTaskRequestDto,
} from "../dtos";
import type {
	CategoryRepository,
	ResourceRepository,
	TaskRepository,
	UserRepository,
} from "../repositories";

export class TaskUseCasesService {
	constructor(
		private categoryRepository: CategoryRepository,
		private resourceRepository: ResourceRepository,
		private taskRepository: TaskRepository,
		private userRepository: UserRepository,
	) {}

	async createTask({
		name,
		description,
		resourcesIds,
		categoryId,
		cadence,
		userId,
		anchorDate: rawAnchorDateIsoString,
	}: CreateTaskRequestDto) {
		// Check liks to categories and resources
		let category: Category | null = null;
		let resources: Resource[] = [];

		const [queriedCategory, queriedResources, user] = await Promise.all([
			categoryId
				? this._getCategoryById(categoryId, userId, "categoryId")
				: undefined,
			resourcesIds !== null
				? this._getAllResourcesByIdList(resourcesIds, userId, "resourcesIds")
				: undefined,
			this._getUser(userId),
		]);

		if (queriedCategory) {
			category = queriedCategory;
		}

		if (queriedResources && queriedResources.length > 0) {
			resources = queriedResources;
		}

		// Cast raw date-iso-string to value-object
		let anchorDate: CalendarDate;
		try {
			anchorDate = CalendarDate.fromISO8601(
				rawAnchorDateIsoString,
				user.timezone,
			);
		} catch {
			throw new BaseDomainError(
				DomainErrorType.BAD_REQUEST,
				"Invalid Date Format",
				[
					{
						field: "anchorDate",
						message: "Invalid Date Format",
					},
				],
			);
		}

		const task = new Task(
			generateId(),
			name,
			description,
			resources.length === 0 ? null : resources.map((r) => r.id),
			category !== null ? category.id : null,
			cadence,
			userId,
			anchorDate,
		);

		const newTask = await this.taskRepository.create(task);
		return {
			id: newTask.id,
		};
	}

	async deleteTask({ id, userId }: DeleteTaskRequestDto): Promise<void> {
		const existingTask = await this._getExistingById(id, userId);
		return this.taskRepository.deleteById(existingTask.id);
	}

	async getTasks({ userId }: GetAllTasksRequestDto) {
		const [tasks, categories, resources] = await Promise.all([
			this.taskRepository.getAllByUserId(userId),
			this.categoryRepository.getAllByUserId(userId),
			this.resourceRepository.getAllByUserId(userId),
		]);

		return tasks.map((t) => {
			const linkedCategory = categories.find((c) => c.id === t.categoryId);
			const linkedResources = resources.filter((r) =>
				(t.resourcesIds || []).includes(r.id),
			);

			return {
				...t,
				anchorDate: t.anchorDate.getISO8601String(),
				category: linkedCategory ?? null,
				resources:
					linkedResources && linkedResources.length > 0
						? linkedResources
						: null,
			};
		});
	}

	async getTaskById({ id, userId }: GetTaskByIdRequestDto) {
		const task = await this._getExistingById(id, userId);

		const [queriedCategory, queriedResources] = await Promise.all([
			task.categoryId
				? this.categoryRepository.getById(task.categoryId)
				: undefined,
			task.resourcesIds
				? this.resourceRepository.getAllByIdList(task.resourcesIds)
				: undefined,
		]);

		return {
			...task,
			anchorDate: task.anchorDate.getISO8601String(),
			category: queriedCategory ?? null,
			resources: queriedResources ?? null,
		};
	}

	async updateTask({
		id,
		name,
		description,
		resourcesIds,
		categoryId,
		cadence,
		anchorDate: rawAnchorDateIsoString,
		userId,
	}: UpdateTaskRequestDto) {
		const [existingTask, user] = await Promise.all([
			this._getExistingById(id, userId),
			this._getUser(userId),
		]);

		let anchorDateToUse: CalendarDate = existingTask.anchorDate;
		if (rawAnchorDateIsoString) {
			try {
				anchorDateToUse = CalendarDate.fromISO8601(
					rawAnchorDateIsoString,
					user.timezone,
				);
			} catch {
				throw new BaseDomainError(
					DomainErrorType.BAD_REQUEST,
					"Invalid Date Format",
					[
						{
							field: "anchorDate",
							message: "Invalid Date Format",
						},
					],
				);
			}
		}

		const categoryPromise = categoryId
			? this._getCategoryById(categoryId, userId, "categoryId")
			: Promise.resolve(undefined);
		const resourcesPromise =
			resourcesIds && resourcesIds.length > 0
				? this._getAllResourcesByIdList(resourcesIds, userId, "resourcesIds")
				: Promise.resolve(undefined);

		const [queriedCategory, queriedResources] = await Promise.all([
			categoryPromise,
			resourcesPromise,
		]);

		const updatedTask = new Task(
			existingTask.id,
			name === undefined ? existingTask.name : name,
			description === undefined ? existingTask.description : description,
			resourcesIds === undefined
				? existingTask.resourcesIds
				: resourcesIds === null
					? null
					: (queriedResources ?? []).map((r) => r.id),
			categoryId === undefined
				? existingTask.categoryId
				: categoryId === null
					? null
					: (queriedCategory?.id ?? null),
			cadence === undefined ? existingTask.cadence : cadence,
			userId,
			anchorDateToUse,
		);

		const newTaskEntry = await this.taskRepository.updateById(id, updatedTask);

		return {
			id: newTaskEntry.id,
		};
	}

	async _getCategoryById(
		categoryId: string,
		userId: string,
		fieldName: string,
	): Promise<Category> {
		const categoryNotFound = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Category with id ${categoryId} not found`,
			[
				{
					field: fieldName,
					message: `Category not found`,
				},
			],
		);

		const category = await this.categoryRepository.getById(categoryId);

		if (!category) throw categoryNotFound;
		if (category.userId !== userId) throw categoryNotFound;

		return category;
	}

	async _getAllResourcesByIdList(
		idList: string[],
		userId: string,
		fieldName: string,
	): Promise<Resource[]> {
		const resourceNotFoundFactory = (id: string) =>
			new BaseDomainError(
				DomainErrorType.NOT_FOUND,
				`Resource with id ${id} not found`,
				[
					{
						field: fieldName,
						message: "Linked resource not found",
					},
				],
			);

		const resources = await this.resourceRepository.getAllByIdList(idList);

		idList.forEach((id) => {
			// Check all required resources arrived
			const resource = resources.find((r) => r.id === id);
			if (resource === undefined) {
				throw resourceNotFoundFactory(id);
			}

			// Check the resouce ownership
			if (resource.userId !== userId) {
				throw resourceNotFoundFactory(id);
			}
		});

		return resources;
	}

	async _getExistingById(id: string, userId: string): Promise<Task> {
		const notFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			`Task with id ${id} not found`,
		);

		const existingTask = await this.taskRepository.getById(id);

		if (!existingTask) throw notFoundError;
		if (existingTask.userId !== userId) throw notFoundError;

		return existingTask;
	}

	async _getUser(userId: string): Promise<User> {
		const userNotFoundError = new BaseDomainError(
			DomainErrorType.NOT_FOUND,
			"Unable to find user",
		);

		const user = await this.userRepository.getById(userId);

		if (!user) {
			throw userNotFoundError;
		}

		return user;
	}
}
