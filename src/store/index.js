import Vue from 'vue';
import Vuex from 'vuex';
import logger from 'vuex/dist/logger';
import * as actions from './actions';
import * as getters from './getters';
import account from './modules/account';
import users from './modules/users';
import serials from './modules/serials';
import storage from './modules/storage';
import orgnizations from './modules/orgnizations';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions,
    getters,
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