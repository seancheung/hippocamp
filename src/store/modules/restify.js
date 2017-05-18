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
        this.types = types;
    }

    get mountState() {
        return {
            items: [],
            error: null,
            busy: false,
            page: 1,
            limit: 20
        };
    }

    get mountGetters() {
        return {
            all: state=> state.items,
            items: state => {
                const begin = state.limit * (state.page - 1);
                return state.items.slice(begin, begin + state.limit);
            },
            page: state => state.page,
            limit: state => state.limit,
            pages: state => Math.ceil(state.items.length / state.limit),
            count: state => state.items.length,
            error: state => state.error,
            busy: state => state.busy,
            url: state => this.url,
            types: state => this.types
        };
    }

    get mountActions() {
        return {
            list({commit, getters, dispatch}) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.get(getters.url)
                        .then(res => {
                            commit(types.LIST_ITEMS, {items: res.body});
                        })
                        .catch(res => {
                            dispatch('handle', res.status);
                            commit(types.LIST_ITEMS, {err: res.body.message, status: res.status});
                        });
            },
            create({commit, getters, dispatch}, data) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.post(getters.url, data)
                    .then(res => {
                        return dispatch('list');
                    })
                    .catch(res => {
                        dispatch('handle', res.status);
                        commit(types.CREATE_ITEM, {err: res.body.message, status: res.status});
                    });
            },
            update({commit, getters, dispatch}, {id, data}) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.put(getters.url + '/' + id, data)
                    .then(res => {
                        return dispatch('list');
                    })
                    .catch(res => {
                        dispatch('handle', res.status);
                        commit(types.UPDATE_ITEM, {err: res.body.message, status: res.status});
                    });
            },
            read({commit, getters, dispatch}, id) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.get(getters.url + '/' + id)
                    .then(res => {
                        commit(types.READ_ITEM, {item: res.body});
                    })
                    .catch(res => {
                        dispatch('handle', res.status);
                        commit(types.READ_ITEM, {err: res.body.message, status: res.status});
                    });
            },
            delete({commit, getters, dispatch}, id) {
                commit(types.BEGIN_REQUEST);
                return Vue.http.delete(getters.url + '/' + id)
                    .then(res => {
                        return dispatch('list');
                    })
                    .catch(res => {
                        dispatch('handle', res.status);
                        commit(types.DELETE_ITEM, {err: res.body.message, status: res.status});
                    });
            },
            paginate({commit}, {page, limit}) {
                commit(types.PAGINATE_ITEMS, {page, limit});
            },
            handle({commit}, status) {
                switch (status) {
                    case 401:
                        Vue.router.push({ name: 'Login' });
                        break;
                    case 403:
                        Vue.router.push({ name: 'Dashboard' });
                        break;
                }
            }
        };
    }

    get mountMutations() {
        return {
            [types.LIST_ITEMS](state, {items, err, status}) {
                state.items = items || [];
                state.error = err;
                state.busy = false;
            },

            [types.CREATE_ITEM](state, {item, err, status}) {
                state.error = err;
                state.busy = false;
            },

            [types.UPDATE_ITEM](state, {item, err, status}) {
                state.error = err;
                state.busy = false;
            },

            [types.READ_ITEM](state, {item, err, status}) {
                state.error = err;
                state.busy = false;
            },

            [types.DELETE_ITEM](state, {id, err, status}) {
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

            [types.PAGINATE_ITEMS](state, {page, limit}) {
                state.page = Math.max(1, Math.min(Math.ceil(state.items.length / state.limit), page));
                state.limit = Math.max(10, limit);
            }
        };
    }
}