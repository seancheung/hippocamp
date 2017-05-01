import Restify from './restify';

class Users extends Restify {
    constructor() {
        super('api/v1/users', 'name');
    }
}

export default new Users();