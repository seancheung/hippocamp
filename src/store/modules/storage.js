import Vue from 'vue';
import Promise from 'bluebird';

const types = {
    BEGIN_REQUEST: 'BEGIN_REQUEST',
    SELECT_ENTRY: 'SELECT_ENTRY',
    CHECK_ENTRY: 'CHECK_ENTRY',
    CREATE_DIR: 'CREATE_DIR',
    REMOVE_ENTRY: 'REMOVE_ENTRY',
    MOVE_ENTRY: 'MOVE_ENTRY',
    RENAME_ENTRY: 'RENAME_ENTRY',
};

const state = {
    entry: null,
    error: null,
    busy: false
};

const getters = {
    entry: state => state.entry,
    path: state => state.entry ? state.entry.path : '',
    busy: state => state.busy,
    error: state => state.error,
};

const actions = {
    select({commit, getters}, path) {
        commit(types.BEGIN_REQUEST);
        return Vue.http.get(`/api/v1/storage/!/${path || getters.path}`)
            .then(res => {
                commit(types.SELECT_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.SELECT_ENTRY, {err: res.body.message});
            });
    },
    check({commit}, {index, checked}) {
        commit(types.CHECK_ENTRY, {index, checked});
    },
    create({commit, getters}, {name, dest}) {
        commit(types.BEGIN_REQUEST);
        return Vue.http.post('/api/v1/storage/dir', {name, dest: dest || getters.path})
            .then(res => {
                commit(types.CREATE_DIR, {entry: res.body});
            })
            .catch(res => {
                commit(types.CREATE_DIR, {err: res.body.message});
            });
    },
    rename({commit, getters}, {entry, name}) {
        commit(types.BEGIN_REQUEST);
        return Vue.http.patch('/api/v1/storage', {src: entry.path, name})
            .then(res => {
                commit(types.RENAME_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.RENAME_ENTRY, {err: res.body.message});
            });
    },
    move({commit, getters}, {entry, dest}) {
        commit(types.BEGIN_REQUEST);
        return Vue.http.put('/api/v1/storage', {src: entry.path, dest})
            .then(res => {
                commit(types.MOVE_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.MOVE_ENTRY, {err: res.body.message});
            });
    },
    remove({commit, getters}, entry) {
        commit(types.BEGIN_REQUEST);
        const body = {};
        if(entry) {
            body.path = entry.path;
        } else {
            for (var i = 0; i < getters.entry.contents.length; i++) {
                const en = getters.entry.contents[i];
                if(en.checked) {
                    body[i] = en.path;
                }                
            }
        }
        return Vue.http.delete('/api/v1/storage', {body})
            .then(res => {
                commit(types.REMOVE_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.REMOVE_ENTRY, {err: res.body.message});
            });
    }
}

const mutations = {
    [types.BEGIN_REQUEST](state, reset) {
        if(reset) {
            state.entry = null;
        }
        state.error = null;
        state.busy = true;
    },
    [types.SELECT_ENTRY](state, {entry, err}) {
        state.entry = entry;
        state.error = err;
        state.busy = false;
    },
    [types.CHECK_ENTRY](state, {index, checked}) {
        if(!state.entry || !state.entry.contents) {
            return;
        }
        if(index === undefined) {
            for (var i = 0; i < state.entry.contents.length; i++) {
                Vue.set(state.entry.contents[i], 'checked', checked);
            }
        } else if(index >=0 && index < state.entry.contents.length) {
            Vue.set(state.entry.contents[index], 'checked', checked);
        }
    },
    [types.CREATE_DIR](state, {err, entry}) {
        state.entry = entry;
        state.error = err;
        state.busy = false;
    },
    [types.REMOVE_ENTRY](state, {err, entry}) {
        state.entry = entry;
        state.error = err;
        state.busy = false;
    },
    [types.MOVE_ENTRY](state, {err, entry}) {
        state.entry = entry;
        state.error = err;
        state.busy = false;
    },
    [types.RENAME_ENTRY](state, {err, entry}) {
        state.entry = entry;
        state.error = err;
        state.busy = false;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}