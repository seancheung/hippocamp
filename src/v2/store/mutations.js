import Vue from 'vue';
import { types } from './types';

export default {
    [types.BEGIN](state) {
        state.error = null;
        state.pending = true;
    },

    [types.REDIRECT](state, route) {
        state.route = route;
    },

    [types.AUTH](state, {jwt, expires, profile, err, save}) {
        state.error = err;
        state.profile = profile;
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