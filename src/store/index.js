import Vue from 'vue';
import Vuex from 'vuex';
import logger from 'vuex/dist/logger';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import account from './modules/account';
import users from './modules/users';
import serials from './modules/serials';
import storage from './modules/storage';
import orgnizations from './modules/orgnizations';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);

const store = new Vuex.Store({
    state,
    actions,
    getters,
    mutations,
    modules: {
        account,
        users,
        serials,
        storage,
        orgnizations
    },
    strict: debug,
    plugins: debug ? [logger()] : []
});

export default {
    install(Vue, options) {
        Vue.store = store;
        Vue.prototype.$store = store;
    }
}