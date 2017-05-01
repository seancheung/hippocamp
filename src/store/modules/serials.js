import Restify from './restify';

class Serials extends Restify {
    constructor() {
        super('api/v1/serials', 'sno');
    }
}

export default new Serials();