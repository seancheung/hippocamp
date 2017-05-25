import Vue from 'vue';
import Promise from 'bluebird';

const types = {
    BEGIN: 'BEGIN',
    SHOW: 'SHOW',
    DOWNLOAD: 'DOWNLOAD',
    UPLOAD: 'UPLOAD',
    MOVE: 'MOVE',
    RENAME: 'RENAME',
    REMOVE: 'REMOVE',
    BULK_REMOVE: 'BULK_REMOVE',
    PROGRESS: 'PROGRESS',
    END: 'END'
}

export default {
    namespaced: true,
    state: {
        item: null,
        pending: false,
        error: null,
        progress: 0,
        wait: false,
        request: null
    },
    getters: {
        item: state => state.item,
        path: state => state.item && state.item.path || '/',
        error: state => state.error,
        pending: state => state.pending,
        wait: state => state.wait,
        progress: state => Math.ceil(state.progress * 100)
    },
    actions: {
        show({commit, getters}, {id, path}) {
            return Promise.cast(Vue.http.get(`/api/v2/users/${id}/storage/!/${path || getters.path}`, {
                before(req) {
                    commit(types.BEGIN, req);
                }
            }))
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
        download({commit, getters}, {id, path}) {
            return Promise.cast(Vue.http.get(`/api/v2/users/${id}/storage/d/${path}?attachment=true`, {
                responseType: 'arraybuffer',
                before(req) {
                    commit(types.BEGIN, req);
                },
                progress(e) {
                    if(e.lengthComputable) {
                        commit(types.PROGRESS, {total: e.total, loaded: e.loaded, wait: true});
                    } else {
                        commit(types.PROGRESS, {wait: true});
                    }
                }
            }))
                .then(res => {
                    commit(types.DOWNLOAD, {});
                    return res;
                })
                .catch(res => {
                    commit(types.DOWNLOAD, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },
        upload({commit, getters, dispatch}, {id, path, files, unarchive}) {
            const form = new FormData();
            if(files && files.length) {
                for (let i = 0; i < files.length; i++) {
                    form.append('files', files[i], files[i].name);
                }
                if(unarchive) {
                    form.append('unarchive', 'true');
                }
            }
            return Promise.cast(Vue.http.post(`/api/v2/users/${id}/storage/!/${path || getters.path}`, form, {
                before(req) {
                    commit(types.BEGIN, req);
                },
                progress(e) {
                    if(e.lengthComputable) {
                        commit(types.PROGRESS, {total: e.total, loaded: e.loaded, wait: true});
                    } else {
                        commit(types.PROGRESS, {wait: true});
                    }
                }
            }))
                .then(res => {
                    commit(types.UPLOAD, {});
                    return dispatch('show', {id, path});
                })
                .catch(res => {
                    commit(types.UPLOAD, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },
        move({commit, getters, dispatch}, {id, path, dest}) {
            return Promise.cast(Vue.http.put(`/api/v2/users/${id}/storage/!/${path}`, {dest}, {
                before(req) {
                    commit(types.BEGIN, req);
                }
            }))
                .then(res => {
                    commit(types.MOVE, {});
                    return dispatch('show', {id});
                })
                .catch(res => {
                    commit(types.MOVE, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },
        rename({commit, getters, dispatch}, {id, path, name}) {
            return Promise.cast(Vue.http.patch(`/api/v2/users/${id}/storage/!/${path}`, {name}, {
                before(req) {
                    commit(types.BEGIN, req);
                }
            }))
                .then(res => {
                    commit(types.RENAME, {});
                    return dispatch('show', {id});
                })
                .catch(res => {
                    commit(types.RENAME, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },
        remove({commit, getters, dispatch}, {id, path}) {
            return Promise.cast(Vue.http.delete(`/api/v2/users/${id}/storage/!/${path}`, {
                before(req) {
                    commit(types.BEGIN, req);
                }
            }))
                .then(res => {
                    commit(types.REMOVE, {});
                    return dispatch('show', {id});
                })
                .catch(res => {
                    commit(types.REMOVE, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },
        bulkRemove({commit, getters, dispatch}, {id, files}) {
            return Promise.cast(Vue.http.delete(`/api/v2/users/${id}/storage/!`, {
                body: {
                    files
                },
                before(req) {
                    commit(types.BEGIN, req);
                }
            }))
                .then(res => {
                    commit(types.BULK_REMOVE, {});
                    return dispatch('show', {id});
                })
                .catch(res => {
                    commit(types.BULK_REMOVE, {err: res.body.message || res.body});
                })
                .finally(() => {
                    commit(types.END);
                });
        },
        abort({commit}) {
            commit(types.END);
        }
    },
    mutations: {
        [types.BEGIN](state, request) {
            if(state.request) {
                state.request.abort();
            }
            state.request = request;
            state.error = null;
            state.pending = true;
        },
        [types.SHOW](state, {err, item}) {
            state.item = item;
            state.error = err;
        },
        [types.DOWNLOAD](state, {err}) {
            state.error = err;
        },
        [types.UPLOAD](state, {err}) {
            state.error = err;
        },
        [types.MOVE](state, {err}) {
            state.error = err;
        },
        [types.RENAME](state, {err}) {
            state.error = err;
        },
        [types.REMOVE](state, {err}) {
            state.error = err;
        },
        [types.BULK_REMOVE](state, {err}) {
            state.error = err;
        },
        [types.PROGRESS](state, {total, loaded, wait}) {
            state.wait = wait;
            if(wait) {
                if(total <= 0) {
                    state.progress = 0;
                } else {
                    state.progress = loaded / total;
                } 
            }
        },
        [types.END](state) {
            if(state.request) {
                state.request.abort();
                state.request = null;
            }
            state.pending = false;
            state.wait = false;
        }
    }
}