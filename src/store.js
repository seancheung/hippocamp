import Vue from './bootstrap';
import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        jwt: null,
        profile: null
    },
    mutations: {
        grant(state, context) {
            state.jwt = context.jwt;
            state.profile = context.profile;
            Vue.http.headers.common['Authorization'] = state.jwt;
        },
        withdraw(state) {
            state.jwt = null;
            Vue.http.headers.common['Authorization'] = '';
        }
    },
    getters: {
        authorized: state => {
            return state.jwt;
        }
    }
});