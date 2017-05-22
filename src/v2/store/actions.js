import Vue from 'vue';
import VueCookie from 'vue-cookie';
import Promise from 'bluebird';
import { types } from './types';

Vue.use(VueCookie);

export default {
    redirect({commit}, route) {
        commit(types.REDIRECT, route);
        return Promise.resolve();
    },

    login({commit, dispatch}, {account, password}) {
        commit(types.BEGIN);
        return Promise.cast(Vue.http.post('/api/v2/account/login', {account, password}))
            .then(res => {
                commit(types.AUTH, {jwt: res.body.jwt, expires: res.body.expires, save: true});
                return dispatch('auth');
            })
            .catch(res => {
                commit(types.AUTH, {err: res.body.message || res.body});
            })
            .finally(() => {
                commit(types.END);
            });
    },

    logout({commit}) {
        commit(types.AUTH, {save: true});
        return Promise.resolve();
    },

    auth({commit}) {        
        const jwt = Vue.cookie.get('jwt');
        if(jwt) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.get('/api/v2/account'))
                .then(res => {
                        commit(types.AUTH, {profile: res.body});
                    })
                    .catch(err => {
                        commit(types.AUTH, {save: true});
                    })
                    .finally(() => {
                        commit(types.END);
                    });
        } else {
            return Promise.resolve();
        }
    }
}