import type { User } from "./user";

export interface BoardArgs {
	id: string;
	name: string;
	content: string;
	userId: User["id"];
}

export class Board implements BoardArgs {
	public readonly id: string;
	public name: string;
	public content: string;
	public userId: string;

	constructor(args: BoardArgs) {
		this.id = args.id;
		this.name = args.name;
		this.content = args.content;
		this.userId = args.userId;
	}
}
