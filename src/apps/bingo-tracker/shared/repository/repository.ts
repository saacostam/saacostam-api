export type Repository<E> = {
	create(entity: E): Promise<E>;
	delete(id: string): Promise<void>;
	getById(id: string): Promise<E | null>;
};
