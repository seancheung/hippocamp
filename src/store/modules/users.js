import Restify from './restify';

class Users extends Restify {
    constructor() {
        super('api/v1/users');
    }
}

export default new Users();