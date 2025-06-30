export class User {
    constructor(
        public readonly id: string, 
        public readonly username: string, 
        public firstName: string, 
        public lastName: string
    ) {}
}

export class Credentials {
    constructor(
        public readonly username: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly passwordHash: string,
    ){}
}
