import Vue from 'vue';
import { types } from './types';

export default {
    [types.BEGIN](state) {
        state.error = null;
        state.pending = true;
        state.success = false;
    },

    [types.REDIRECT](state, route) {
        state.route = route;
    },

    [types.UPDATE](state, {err, account}) {
        state.error = err;
        state.account = account;
        state.success = !err;
    },

    [types.AUTH](state, {account, err}) {
        state.error = err;
        state.account = account;
    },

    [types.LOGIN](state, {jwt, expires, err, save}) {
        state.error = err;
        state.route = null;
        state.account = null;
        if(save) {
            if(jwt) {
                Vue.cookie.set('jwt', jwt, { expires: expires.toUpperCase() });
            } else {
                Vue.cookie.delete('jwt');
            }
        }
    },

    [types.END](state) {
        state.pending = false;
    },
}