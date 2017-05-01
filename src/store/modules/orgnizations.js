import Restify from './restify';

class Orgnizations extends Restify {
    constructor() {
        super('api/v1/orgnizations', 'name');
    }
}

export default new Orgnizations();