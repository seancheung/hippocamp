import Vue from 'vue';
import Promise from 'bluebird';

const types = {
    BEGIN: 'BEGIN',
    LIST: 'LIST',
    UPDATE: 'UPDATE',
    GENERATE: 'GENERATE',
    REMOVE: 'REMOVE',
    CLEAR: 'CLEAR',
    END: 'END'
}

export default {
    namespaced: true,
    state: {
        items: null,
        pending: false,
        error: null,
        success: false
    },
    getters: {
        items: state => state.items,
        error: state => state.error,
        pending: state => state.pending,
        success: state => state.success
    },
    actions: {
        list({commit}, id) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.get(`/api/v2/orgnizations/${id}/serials`))
                .then(res => {
                    commit(types.LIST, {items: res.body});
                })
                .catch(res => {
                    commit(types.LIST, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },

        generate({commit}, {id, context}) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.post(`/api/v2/orgnizations/${id}/serials`, context))
                .then(res => {
                    commit(types.GENERATE, {});
                })
                .catch(res => {
                    commit(types.GENERATE, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },

        remove({commit}, {id, context}) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.delete(`/api/v2/orgnizations/${id}/serials`, {body: context}))
                .then(res => {
                    commit(types.REMOVE, {});
                })
                .catch(res => {
                    commit(types.REMOVE, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },

        clear({commit}, id) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.delete(`/api/v2/orgnizations/${id}/serials/all`))
                .then(res => {
                    commit(types.CLEAR, {});
                })
                .catch(res => {
                    commit(types.CLEAR, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        }
    },
    mutations: {
        [types.BEGIN](state) {
            state.error = null;
            state.pending = true;
            state.success = false;
        },
        [types.LIST](state, {err, items}) {
            state.items = items;
            state.error = err;
        },
        [types.GENERATE](state, {err}) {
            state.error = err;
            state.success = !err;
        },
        [types.REMOVE](state, {err}) {
            state.error = err;
        },
        [types.CLEAR](state, {err}) {
            state.error = err;
        },
        [types.END](state) {
            state.pending = false;
        }
    }
}