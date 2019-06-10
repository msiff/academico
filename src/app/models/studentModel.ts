import { Father } from './fatherModel';

export class Student {
    constructor(
        public _id: String,
        public name: String,
        public surname: String,
        public birthDate: Date,
        public phone: String,
        public details: String,
        public father: Father,
        public state: Boolean,
        public gender: String,
        public createdAt: Date,
    ) {}
}
