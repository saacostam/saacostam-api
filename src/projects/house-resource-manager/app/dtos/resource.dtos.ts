export interface CreateResourceRequestDto {
	name: string;
	description: string | null;
	quantity: number;
	categoryId: string | null;
	userId: string;
}

export interface DeleteResourceRequestDto {
	id: string;
	userId: string;
}

export interface UpdateResourceRequestDto {
	id: string;
	name?: string;
	description?: string | null;
	quantity?: number;
	categoryId?: string | null;
	userId: string;
}

export interface GetAllResourcesRequestDto {
	userId: string;
}

export interface GetResourceByIdRequestDto {
	id: string;
	userId: string;
}
