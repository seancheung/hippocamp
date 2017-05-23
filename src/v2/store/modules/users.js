import Vue from 'vue';
import Promise from 'bluebird';

const types = {
    BEGIN: 'BEGIN',
    LIST: 'LIST',
    SHOW: 'SHOW',
    UPDATE: 'UPDATE',
    CREATE: 'CREATE',
    REMOVE: 'REMOVE',
    END: 'END'
}

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,
        pending: false,
        error: null
    },
    getters: {
        items: state => state.items,
        item: state => state.item,
        error: state => state.error,
        pending: state => state.pending,
    },
    actions: {
        list({commit}, id) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.get(`/api/v2/orgnizations/${id}/users`))
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

        show({commit}, id) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.get(`/api/v2/users/${id}`))
                .then(res => {
                    commit(types.SHOW, {item: res.body});
                })
                .catch(res => {
                    commit(types.SHOW, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },

        update({commit}, {id, context}) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.put(`/api/v2/users/${id}`, context))
                .then(res => {
                    commit(types.UPDATE, {item: res.body});
                })
                .catch(res => {
                    commit(types.UPDATE, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },

        create({commit}, {id, context}) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.post(`/api/v2/orgnizations/${id}/users`, context))
                .then(res => {
                    commit(types.CREATE, {item: res.body});
                })
                .catch(res => {
                    commit(types.CREATE, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },

        remove({commit}, id) {
            commit(types.BEGIN);
            return Promise.cast(Vue.http.delete(`/api/v2/users/${id}`))
                .then(res => {
                    commit(types.REMOVE, {});
                })
                .catch(res => {
                    commit(types.REMOVE, {err: res.body.message || res.body});
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
        },
        [types.LIST](state, {err, items}) {
            state.items = items;
            state.error = err;
        },
        [types.SHOW](state, {err, item}) {
            state.item = item;
            state.error = err;
        },
        [types.UPDATE](state, {err, item}) {
            state.item = item;
            state.error = err;
        },
        [types.CREATE](state, {err, item}) {
            state.item = item;
            state.error = err;
        },
        [types.REMOVE](state, {err}) {
            state.item = null;
            state.error = err;
        },
        [types.END](state) {
            state.pending = false;
        }
    }
}