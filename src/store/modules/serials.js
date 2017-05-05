import Vue from 'vue';
import Restify from './restify';

class Serials extends Restify {
    constructor() {
        super('api/v1/serials', 'sno');
    }

    get mountActions() {
        const actions = super.mountActions;

        actions.bulk = function ({
            commit,
            getters,
            dispatch
        }, data) {
            commit(getters.types.BEGIN_REQUEST);
            return Vue.http.post(getters.url + '/bulk', data)
                .then(res => {
                    return dispatch('list');
                })
                .catch(res => {
                    commit(getters.types.CREATE_ITEM, {
                        err: res.body.message
                    });
                });
        };

        return actions;
    }
}

export default new Serials();