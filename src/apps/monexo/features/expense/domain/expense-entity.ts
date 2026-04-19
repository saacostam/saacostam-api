import type { ICategory } from "@/apps/monexo/features/category/domain";

export interface IExpense {
	id: string;
	name: string;
	description: string;
	amount: number;
	date: number;
	userId: string;
	categoryId: string | null;
}

export type IWithCategory<T> = T & {
	category: ICategory | null;
};
