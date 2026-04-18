import type { ICategoryRepository } from "@/apps/monexo/features/category/domain";
import type { IUserRepository } from "@/apps/monexo/features/user/domain";
import type {
	IGenIdAdapter,
	IJwtTokenAdapter,
	IPasswordHasherAdapter,
} from "@/apps/monexo/shared/providers/domain";

export interface IContext {
	repo: {
		category: ICategoryRepository;
		user: IUserRepository;
	};
	prov: {
		genId: IGenIdAdapter;
		pwHasher: IPasswordHasherAdapter;
		jwt: IJwtTokenAdapter;
	};
}
