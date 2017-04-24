import Vue from './bootstrap';
import Vuex from 'vuex';

const setHeaders = token => {
    Vue.http.interceptors.push((req, next) => {
        req.headers['Authorization'] = token;
        req.headers['Accept'] = 'application/json';
        next();
    });
}

const jwt = Vue.cookie.get('jwt');

if (jwt) {
    setHeaders(jwt);
}

export default new Vuex.Store({
    state: {
        jwt: jwt
    },
    mutations: {
        auth(state, token) {
            state.jwt = token;
            setHeaders(token);
            Vue.cookie.set('jwt', token, {
                expires: '7D'
            });
        },
        unAuth(state) {
            state.jwt = null;
            Vue.cookie.delete('jwt');
        }
    },
    getters: {
        authed: state => {
            return state.jwt;
        }
    }
});