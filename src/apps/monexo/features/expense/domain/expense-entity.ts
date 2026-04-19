export interface IExpense {
	id: string;
	name: string;
	description: string;
	amount: number;
	date: number;
	userId: string;
	categoryId: string | null;
}
