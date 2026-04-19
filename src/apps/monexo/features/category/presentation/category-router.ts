import { Router } from "express";
import { categoryUseCases, withAuth } from "@/apps/monexo/shared/di/root";
import { errorFactory } from "@/apps/monexo/shared/errors";
import { CategoryValidator } from "./validators";

export const categoryRouter = Router();

categoryRouter.get(
	"/",
	withAuth(async (req, res) => {
		const response = await categoryUseCases.getCategories({
			userId: req.user.userId,
		});
		res.status(200).json(response);
	}),
);

categoryRouter.get(
	"/:id",
	withAuth(async (req, res) => {
		const id = req.params.id;
		if (!id)
			throw errorFactory.fieldMissing({
				field: {
					detailedName: "Category id",
					name: "id",
				},
				ctx: "categoryRouter.get - get category by id",
			});

		const response = await categoryUseCases.getById({
			id,
			userId: req.user.userId,
		});
		res.status(200).json(response);
	}),
);

categoryRouter.post(
	"/",
	withAuth(async (req, res) => {
		const payload = CategoryValidator.createCategory.parse(req.body);

		const response = await categoryUseCases.createCategory({
			description: payload.description,
			name: payload.name,
			userId: req.user.userId,
		});
		res.status(201).json(response);
	}),
);

categoryRouter.put(
	"/:categoryId",
	withAuth(async (req, res) => {
		const categoryId = req.params.categoryId;
		if (!categoryId)
			throw errorFactory.fieldMissing({
				field: {
					detailedName: "Category id",
					name: "categoryId",
				},
				ctx: "categoryRouter.put - update category",
			});

		const payload = CategoryValidator.updateCategory.parse(req.body);

		const response = await categoryUseCases.updateCategory({
			description: payload.description,
			id: categoryId,
			name: payload.name,
			userId: req.user.userId,
		});
		res.status(200).json(response);
	}),
);
