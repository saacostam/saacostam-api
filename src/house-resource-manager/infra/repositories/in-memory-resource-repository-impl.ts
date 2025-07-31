import type { ResourceRepository } from "../../app/repositories";
import type { Resource } from "../../domain/entities";

let RESOURCES: Resource[] = [];

export class InMemoryResourceRepositoryImpl implements ResourceRepository {
	create(resource: Resource): Promise<Resource> {
		RESOURCES.push(resource);
		return new Promise((res) => res(resource));
	}

	deleteById(id: string): Promise<void> {
		RESOURCES = RESOURCES.map((r) =>
			r.id === id ? { ...r, status: "archived" } : r,
		);

		return new Promise((res) => res());
	}

	getAllByUserId(userId: string): Promise<Resource[]> {
		const resourcesOfUser = RESOURCES.filter(
			(r) => r.status === "active",
		).filter((r) => r.userId === userId);

		return new Promise((res) => res(resourcesOfUser));
	}

	getAllByIdList(ids: string[]): Promise<Resource[]> {
		const resoucesByIdList = RESOURCES.filter((r) => ids.includes(r.id));

		return new Promise((res) => res(resoucesByIdList));
	}

	getById(id: string): Promise<Resource | undefined> {
		const resource = RESOURCES.find(
			(r) => r.id === id && r.status === "active",
		);

		return new Promise((res) => res(resource));
	}

	updateById(id: string, resource: Resource): Promise<Resource> {
		RESOURCES = RESOURCES.map((r) => (r.id === id ? resource : r));

		return new Promise((res) => res(resource));
	}
}
