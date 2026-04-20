import { z } from "zod";

const amountField = z.number().finite();
const categoryIdField = z.string().nullable().optional();
const dateField = z.number();
const descriptionField = z.string().min(0).max(500).nullable().optional();
const nameField = z
	.string()
	.min(1, "Required")
	.max(30, "Max 30 characters allowed");

const createExpense = z.object({
	amount: amountField,
	categoryId: categoryIdField,
	date: dateField,
	description: descriptionField,
	name: nameField,
});

export const ExpenseValidator = {
	createExpense,
};
