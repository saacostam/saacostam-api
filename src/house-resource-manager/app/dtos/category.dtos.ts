export interface CreateCategoryRequestDto {
	name: string;
	description?: string | null;
}

export interface DeleteCategoryRequestDto {
	id: string;
}

export interface UpdateCategoryRequestDto {
	id: string;
	name?: string;
	description?: string | null;
}
