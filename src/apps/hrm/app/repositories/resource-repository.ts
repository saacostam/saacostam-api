import type { Resource } from "../../domain/entities";

export interface ResourceRepository {
	create(resource: Resource): Promise<Resource>;
	deleteById(id: string): Promise<void>;
	getAllByUserId(userId: string): Promise<Resource[]>;
	countAllByUserid(userId: string): Promise<number>;
	getAllByIdList(ids: string[]): Promise<Resource[]>;
	getById(id: string): Promise<Resource | undefined>;
	updateById(id: string, resource: Resource): Promise<Resource>;
}
