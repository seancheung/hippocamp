import Restify from './restify';

class Orgnizations extends Restify {
    constructor() {
        super('api/v1/orgnizations');
    }
}

export default new Orgnizations();