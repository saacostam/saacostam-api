import type { Category, Resource } from "../../domain/entities";

export type TGetResourceByIdResponse = Resource & {
	category: Category | null;
};

export type TGetAllResourcesResponse = TGetResourceByIdResponse[];

export type TCreateResourceResponse = Pick<Resource, "id">;
export type TUpdateResourceResponse = Pick<Resource, "id">;
