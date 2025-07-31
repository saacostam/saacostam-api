import type { Category, Resource } from "../../domain/entities";

export type TGetResourceByIdResponse = Resource & {
	category: Category | null;
};

export type TGetAllResourcesResponse = TGetResourceByIdResponse[];
