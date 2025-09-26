import type { User } from "./user";

export interface ScratchBoardArgs {
	id: string;
	name: string;
	content: string;
	userId: User["id"];
}

export class ScratchBoard implements ScratchBoardArgs {
	public readonly id: string;
	public name: string;
	public content: string;
	public userId: string;

	constructor(args: ScratchBoardArgs) {
		this.id = args.id;
		this.name = args.name;
		this.content = args.content;
		this.userId = args.userId;
	}
}
