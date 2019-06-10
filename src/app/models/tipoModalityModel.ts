export class TipoModality {
    constructor(
        public _id: String,
        public type: String,
        public price: Number,
        public state: Boolean,
        public createdAt: Date,
    ) {}
}
