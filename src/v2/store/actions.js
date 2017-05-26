import Vue from 'vue';
import VueCookie from 'vue-cookie';
import Promise from 'bluebird';
import { types } from './types';

Vue.use(VueCookie);

export default {
    redirect({commit}, route) {
        return Promise.resolve(commit(types.REDIRECT, route));
    },

    login({commit, dispatch}, {account, password}) {
        commit(types.BEGIN);
        return Promise.cast(Vue.http.post('/api/v2/account/login', {account, password}))
            .then(res => {
                commit(types.LOGIN, {jwt: res.body.jwt, expires: res.body.expires, save: true});
                return dispatch('auth');
            })
            .catch(res => {
                commit(types.LOGIN, {err: res.body.message || res.body});
            })
            .finally(() => {
                commit(types.END);
            });
    },

    logout({commit}) {
        return Promise.resolve(commit(types.LOGIN, {save: true}));
    },

    auth({commit}) {        
        const jwt = Vue.cookie.get('jwt');
        if(jwt) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.get('/api/v2/account'))
                .then(res => {
                    commit(types.AUTH, {account: res.body});
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
    },

    update({commit}, context) {
        commit(types.BEGIN);
        return Promise.cast(Vue.http.put('/api/v2/account', context))
            .then(res => {
                commit(types.UPDATE, {account: res.body});
            })
            .catch(err => {
                commit(types.UPDATE, {err: res.body.message || res.body});
            })
            .finally(() => {
                commit(types.END);
            });
    }
}