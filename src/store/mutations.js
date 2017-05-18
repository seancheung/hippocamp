import { types } from './types';

export default {
    [types.REDIRECT](state, route) {
        state.route = route;
    }
}