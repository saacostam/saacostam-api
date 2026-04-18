import type { ICategory } from "@/apps/monexo/features/category/domain";

let privateId = 0;

export const mockCategoryFactory = {
	gen(override?: Partial<ICategory>): ICategory {
		privateId++;

		const id = String(privateId);

		return {
			id,
			name: `name-${id}`,
			description: `descrption-${id}`,
			ownership: {
				type: "public",
			},
			...override,
		};
	},
};
