import Vue from './bootstrap';
import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        jwt: Vue.cookie.get('jwt'),
        profile: null
    },
    mutations: {
        grant(state, token) {
            state.jwt = token;
            Vue.http.interceptors.push((req, next) => {
                req.headers.set('Authorization', token);
                next();
            });
        },
        withdraw(state) {
            state.jwt = null;
            Vue.http.interceptors.pop();
        },
        profile(state) {
            state.profile = state;
        }
    },
    getters: {
        authorized: state => {
            return state.jwt;
        }
    }
});