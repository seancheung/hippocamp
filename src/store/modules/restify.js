import Vue from 'vue';

const types = {
    LIST_ITEMS: 'LIST_ITEMS',
    CREATE_ITEM: 'CREATE_ITEM',
    UPDATE_ITEM: 'UPDATE_ITEM',
    READ_ITEM: 'READ_ITEM',
    DELETE_ITEM: 'DELETE_ITEM',
    BEGIN_REQUEST: 'BEGIN_REQUEST',
    PAGINATE_ITEMS: 'PAGINATE_ITEMS'
};

export default class Restify {
    constructor(url) {
        this.namespaced = true;
        this.state = this.mountState;
        this.getters = this.mountGetters;
        this.actions = this.mountActions;
        this.mutations = this.mountMutations;
        this.url = url;
    }

    get mountState() {
        return {
            items: [],
            error: null,
            busy: false,
            pagination: {
                limit: 20,
                current: 0,
                total: 0,
                count: 0
            }
        };
    }

    get mountGetters() {
        return {
            items: state => state.items,
            count: state => state.items.length,
            pagination: state => state.pagination,
            error: state => state.error,
            busy: state => state.busy,
            url: state => this.url
        };
    }

    get mountActions() {
        return {
            list({commit, getters}) {
                commit(types.BEGIN_REQUEST, true);
                return Vue.http.get(getters.url + '?s=' + getters.pagination.limit + '&p=' + getters.pagination.current)
                    .then(res => {
                        commit(types.LIST_ITEMS, {items: res.body.docs, pagination: res.body.pagination});
                    })
                    .catch(err => {
                        commit(types.LIST_ITEMS, {err: err.message});
                    });
            },
            create({commit, getters}, data) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.post(getters.url, data)
                    .then(res => {
                        commit(types.CREATE_ITEM, {item: res.body});
                    })
                    .catch(err => {
                        commit(types.CREATE_ITEM, {err: err.message});
                    });
            },
            update({commit, getters}, {id, data}) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.post(getters.url + '/' + id, data)
                    .then(res => {
                        commit(types.UPDATE_ITEM, {item: res.body});
                    })
                    .catch(err => {
                        commit(types.UPDATE_ITEM, {err: err.message});
                    });
            },
            read({commit, getters}, id) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.get(getters.url + '/' + id)
                    .then(res => {
                        commit(types.READ_ITEM, {item: res.body});
                    })
                    .catch(err => {
                        commit(types.READ_ITEM, {err: err.message});
                    });
            },
            delete({commit, getters}, id) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.delete(getters.url + '/' + id)
                    .then(res => {
                        commit(types.DELETE_ITEM, {id});
                    })
                    .catch(err => {
                        commit(types.DELETE_ITEM, {err: err.message});
                    });
            },
            paginate({commit, dispatch}, index) {
                commit(types.PAGINATE_ITEMS, index);
                return dispatch('list');
            }
        };
    }

    get mountMutations() {
        return {
            [types.LIST_ITEMS](state, {items, pagination, err}) {
                if(!err) {
                    state.pagination = pagination;
                }
                state.items = items || [];
                state.error = err;
                state.busy = false;
            },

            [types.CREATE_ITEM](state, {item, err}) {
                if(!err) {
                    state.items.push(item);
                }
                state.error = err;
                state.busy = false;
            },

            [types.UPDATE_ITEM](state, {item, err}) {
                if(!err) {
                    const index = state.items.findIndex(i =>i._id == item._id);
                    if(index >= 0) {
                        Vue.set(state.items, index, item);
                    }
                }
                state.error = err;
                state.busy = false;
            },

            [types.READ_ITEM](state, {item, err}) {
                state.selected = item;
                state.error = err;
                state.busy = false;
            },

            [types.DELETE_ITEM](state, {id, err}) {
                if(!err) {
                    const index = state.items.findIndex(i =>i._id == id);
                    if(index >= 0) {
                        state.items.splice(index, 1);
                    }
                }
                state.error = err;
                state.busy = false;
            },

            [types.BEGIN_REQUEST](state, reset) {
                if(reset) {
                    state.items = [];
                }
                state.error = null;
                state.busy = true;
            },

            [types.PAGINATE_ITEMS](state, index) {
                state.pagination.current = Math.max(0, Math.min(index, state.pagination.total));
            }
        };
    }
}