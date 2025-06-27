export class User {
    constructor(
        private readonly id: string, 
        public readonly username: string, 
        public firstName: string, 
        public lastName: string
    ) {}
}
