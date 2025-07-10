export interface CreateCategoryRequestDto {
	name: string;
	description?: string | null;
	userId: string;
}

export interface DeleteCategoryRequestDto {
	id: string;
	userId: string;
}

export interface UpdateCategoryRequestDto {
	id: string;
	name?: string;
	description?: string | null;
	userId: string;
}

export interface GetAllCategoriesRequestDto {
	userId: string;
}
