class Singleton {
    constructor() {
        if (this.constructor.singleton)
            return this.constructor.singleton;
        this.constructor.singleton = this;
    }

    static get Instance() {
        return new this;
    }
}