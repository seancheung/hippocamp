import Restify from './restify';
import Vue from 'vue';

class Buckets extends Restify {
    constructor() {
        super('api/v1/buckets');
        this.types.LIST_RESOURCES = 'LIST_RESOURCES';
        this.types.SELECT_BUCKET = 'SELECT_BUCKET';
    }

    get mountState() {
        const state = super.mountState;
        state.resources = [];
        state.selected = null;
        return state;
    }

    get mountGetters() {
        const getters = super.mountGetters;
        getters.resources = state => state.resources;
        getters.selected = state => state.selected;
        return getters;
    }

    get mountActions() {
        const actions = super.mountActions;
        actions.listResources = function({commit, getters}, id) {
            commit(getters.types.BEGIN_REQUEST);
            return Vue.http.get(`${getters.url}/${id}/resources`)
                        .then(res => {
                            commit(getters.types.LIST_RESOURCES, {items: res.body});
                        })
                        .catch(res => {
                            commit(getters.types.LIST_RESOURCES, {err: res.body.message});
                        });
        }
        actions.select = function({commit, getters, dispatch}, item) {
            commit(getters.types.SELECT_BUCKET, {item});
            return dispatch('listResources', item._id);
        }
        return actions;
    }

    get mountMutations() {
        const mutations = super.mountMutations;
        mutations.SELECT_BUCKET = function(state, {item, err}) {
            state.selected = item;
            state.error = err;
            state.busy = false;
        }
        mutations.LIST_RESOURCES = function(state, {items, err}) {
            state.resources = items || [];
            state.error = err;
            state.busy = false;
        }
        return mutations;
    }
}

export default new Buckets();