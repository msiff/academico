export class User {
    constructor(
        public _id: String,
        public name: String,
        public surname: String,
        public alias: String,
        public password: String,
        public role: String,
        public state: Boolean,
        public createdAt: Date,
    ) {}
}
