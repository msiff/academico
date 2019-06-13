import { TipoModality } from './tipoModalityModel';
import { User } from './userModel';

export class Modality {
    constructor(
        public _id: String,
        public name: String,
        public dance: String,
        public type: TipoModality,
        public year: Date,
        public state: Boolean,
        public teachers: [User],
        public createdAt: Date,
    ) {}
}
