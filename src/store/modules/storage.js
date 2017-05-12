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
    UPLOAD_ENTRY: 'UPLOAD_ENTRY',
    ABORT_REQUEST: 'ABORT_REQUEST',
    PROGRESS_CHANGE: 'PROGRESS_CHANGE',
    DOWNLOAD_ENTRY: 'DOWNLOAD_ENTRY',
    CREATE_SHARING: 'CREATE_SHARING',
    LIST_SHARINGS: 'LIST_SHARINGS',
    REMOVE_SHARINGS: 'REMOVE_SHARINGS'
};

const state = {
    entry: null,
    error: null,
    busy: false,
    request: null,
    progress: 0,
    pending: false,
    sharings: []
};

const getters = {
    entry: state => state.entry,
    path: state => state.entry ? state.entry.path : '',
    busy: state => state.busy,
    error: state => state.error,
    progress: state => Math.ceil(state.progress * 100),
    pending: state => state.pending,
    sharings: state => state.sharings
};

const actions = {
    select({commit, getters}, path) {
        return Vue.http.get(`/api/v1/storage/!/${path || getters.path}`, {before(req){commit(types.BEGIN_REQUEST, {req});}})
            .then(res => {
                commit(types.SELECT_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.SELECT_ENTRY, {err: res.body.message, status: res.status});
            });
    },
    download({commit, getters}, path) {
        return Vue.http.get(`/api/v1/storage/_/${path}`, {
            responseType: 'arraybuffer',
            before(req) {
                commit(types.BEGIN_REQUEST, {req});
            },
            progress(e) {
                if(e.lengthComputable) {
                    commit(types.PROGRESS_CHANGE, {total: e.total, loaded: e.loaded, pending: true});
                } else {
                    commit(types.PROGRESS_CHANGE, {pending: true});
                }
            }
        })
        .catch(res => {
            commit(types.DOWNLOAD_ENTRY, res.body.message);
        })
        .finally(res => {
            commit(types.DOWNLOAD_ENTRY);
        });
    },
    check({commit}, {index, checked}) {
        commit(types.CHECK_ENTRY, {index, checked});
    },
    create({commit, getters}, name) {
        return Vue.http.post('/api/v1/storage/dir', {name, dest: getters.path}, {before(req){commit(types.BEGIN_REQUEST, {req});}})
            .then(res => {
                commit(types.CREATE_DIR, {entry: res.body});
            })
            .catch(res => {
                commit(types.CREATE_DIR, {err: res.body.message, status: res.status});
            });
    },
    rename({commit, getters}, {entry, name}) {
        return Vue.http.patch('/api/v1/storage', {src: entry.path, name}, {before(req){commit(types.BEGIN_REQUEST, {req});}})
            .then(res => {
                commit(types.RENAME_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.RENAME_ENTRY, {err: res.body.message, status: res.status});
            });
    },
    move({commit, getters}, {entry, dest}) {
        return Vue.http.put('/api/v1/storage', {src: entry.path, dest}, {before(req){commit(types.BEGIN_REQUEST, {req});}})
            .then(res => {
                commit(types.MOVE_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.MOVE_ENTRY, {err: res.body.message, status: res.status});
            });
    },
    remove({commit, getters}, entry) {
        const body = {dest: getters.entry.path};
        if(entry) {
            body.entry = entry.path;
        } else {
            body.entry = getters.entry.contents.filter(e => e.checked).map(e => e.path);
        }
        return Vue.http.delete('/api/v1/storage', {body, before(req){commit(types.BEGIN_REQUEST, {req});}})
            .then(res => {
                commit(types.REMOVE_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.REMOVE_ENTRY, {err: res.body.message, status: res.status});
            });
    },
    upload({commit, getters}, {files, archive}) {
        if(!files || !files.length) {
            return;
        }
        const form = new FormData();
        for (var i = 0; i < files.length; i++) {
            form.append('entry', files[i], files[i].name);
        }
        form.append('dest', getters.entry.path);
        return Vue.http.post(`/api/v1/storage/${archive?'zip':''}`, form, 
                {
                    before(req) {
                        commit(types.BEGIN_REQUEST, {req});
                    },
                    progress(e) {
                        if(e.lengthComputable) {
                            commit(types.PROGRESS_CHANGE, {total: e.total, loaded: e.loaded, pending: true});
                        } else {
                            commit(types.PROGRESS_CHANGE, {pending: true});
                        }
                    }
                }
            )
            .then(res => {
                commit(types.UPLOAD_ENTRY, {entry: res.body});
            })
            .catch(res => {
                commit(types.UPLOAD_ENTRY, {err: res.body.message, status: res.status});
            });
    },
    listSharings({commit}) {
        return Vue.http.get('/api/v1/storage/dl', {before(req){commit(types.BEGIN_REQUEST, {req});}})
            .then(res => {
                commit(types.LIST_SHARINGS, {sharings: res.body});
            })
            .catch(res => {
                commit(types.LIST_SHARINGS, {err: res.body.message, status: res.status});
            });
    },
    createSharing({commit, dispatch}, {path, pwd, expires}) {
        return Vue.http.post('/api/v1/storage/dl', {path, pwd, expires}, {before(req){commit(types.BEGIN_REQUEST, {req});}})
            .then(res => {
                return dispatch('listSharings');
            })
            .catch(res => {
                commit(types.CREATE_SHARING, {err: res.body.message, status: res.status});
            });
    },
    removeSharing({commit, dispatch}, path) {
        return Vue.http.delete('/api/v1/storage/dl', {body: {path}, before(req){commit(types.BEGIN_REQUEST, {req});}})
            .then(res => {
                return dispatch('listSharings');
            })
            .catch(res => {
                commit(types.REMOVE_SHARING, {err: res.body.message, status: res.status});
            });
    },
    abort({commit}) {
        commit(types.ABORT_REQUEST);
    }
}

const mutations = {
    [types.BEGIN_REQUEST](state, {reset, req}) {
        if(state.request) {
            state.request.abort();
            state.request = null;
        }
        if(reset) {
            state.entry = null;
            state.sharings = [];
        }
        if(req) {
            state.request = req;
        }
        state.error = null;
        state.busy = true;
        state.progress = 0;
        state.pending = false;
    },
    [types.SELECT_ENTRY](state, {err, entry, status}) {
        if(status === undefined) {
            state.entry = entry;
        }
        state.error = err;
        state.busy = false;
        state.request = null;
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
    [types.CREATE_DIR](state, {err, entry, status}) {
        if(status === undefined) {
            state.entry = entry;
        }
        state.error = err;
        state.busy = false;
        state.request = null;
    },
    [types.REMOVE_ENTRY](state, {err, entry, status}) {
        if(status === undefined) {
            state.entry = entry;
        }
        state.error = err;
        state.busy = false;
        state.request = null;
    },
    [types.MOVE_ENTRY](state, {err, entry, status}) {
        if(status === undefined) {
            state.entry = entry;
        }
        state.error = err;
        state.busy = false;
        state.request = null;
    },
    [types.RENAME_ENTRY](state, {err, entry, status}) {
        if(status === undefined) {
            state.entry = entry;
        }
        state.error = err;
        state.busy = false;
        state.request = null;
    },
    [types.UPLOAD_ENTRY](state, {err, entry, status}) {
        if(status === undefined) {
            state.entry = entry;
        }
        state.error = err;
        state.busy = false;
        state.request = null;
        state.pending = false;
    },
    [types.LIST_SHARINGS](state, {err, sharings, status}) {
        if(status === undefined) {
            state.sharings = sharings;
        }
        state.error = err;
        state.busy = false;
        state.request = null;
        state.pending = false;
    },
    [types.CREATE_SHARING](state, {err, status}) {
        state.error = err;
        state.busy = false;
        state.request = null;
        state.pending = false;
    },
    [types.REMOVE_SHARINGS](state, {err, status}) {
        state.error = err;
        state.busy = false;
        state.request = null;
        state.pending = false;
    },
    [types.DOWNLOAD_ENTRY](state, err) {
        state.error = err;
        state.busy = false;
        state.request = null;
        state.pending = false;
    },
    [types.ABORT_REQUEST](state) {
        if(state.request) {
            state.request.abort();
            state.request = null;
        }
        state.error = null;
        state.busy = false;
        state.pending = false;
    },
    [types.PROGRESS_CHANGE](state, {total, loaded, pending}) {
        state.pending = pending;
        if(pending) {
            if(total <= 0) {
                state.progress = 0;
            } else {
                state.progress = loaded / total;
            } 
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}