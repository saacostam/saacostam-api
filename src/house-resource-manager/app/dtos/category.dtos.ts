export interface CreateCategoryRequestDto {
    name: string;
    description?: string | null;
}

export interface UpdateCategoryRequestDto {
    id: string;
    name?: string;
    description?: string | null;
}
