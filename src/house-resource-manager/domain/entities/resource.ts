import { Category } from "./category";

export class Resouce {
    constructor(
        public readonly id: string,
        public name: string,
        public description: string,
        public status: "active" | "archived",
        public readonly creationDate: Date,
        public updateDate: Date,
        public categoryId: Category["id"],
    ){}
}
