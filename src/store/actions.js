import { types } from './types';

export default {
    redirect({ commit }, route) {
        commit(types.REDIRECT, route);
    }
}