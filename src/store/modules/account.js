import Vue from 'vue';
import VueCookie from 'vue-cookie';
import Promise from 'bluebird';

Vue.use(VueCookie);

const types = {
    RECEIVE_PROFILE: 'RECEIVE_PROFILE'
};

const state = {
    profile: null,
    error: null,
};

const getters = {
    profile: state => state.profile,
    loginError: state => state.error
};

const actions = {
    login({
        commit,
        dispatch
    }, {
        account,
        password
    }) {
        commit(types.RECEIVE_PROFILE, {});
        return Vue.http.post('/api/v1/auth/login', {
                account,
                password
            }).then(res => {
                if (res.body.success) {
                    commit(types.RECEIVE_PROFILE, {
                        jwt: res.body.jwt,
                        profile: res.body.profile,
                        save: true
                    });
                } else {
                    commit(types.RECEIVE_PROFILE, {
                        err: res.body.message
                    });
                }
            })
            .catch(err => {
                commit(types.RECEIVE_PROFILE, {
                    err: err.message
                });
            });
    },

    logout({
        commit
    }) {
        return Promise.try(() => {
            commit(types.RECEIVE_PROFILE, {
                save: true
            });
        });
    },

    checkCookie({
        commit,
        dispatch
    }) {
        return Promise.try(() => {
            commit(types.RECEIVE_PROFILE, {});
            const jwt = Vue.cookie.get('jwt');
            if (jwt) {
                return Vue.http.get('/api/v1/account')
                    .then(res => {
                        commit(types.RECEIVE_PROFILE, {
                            jwt,
                            profile: res.body
                        });
                    })
                    .catch(err => {
                        commit(types.RECEIVE_PROFILE, {
                            save: true
                        });
                    });
            }
        })
    }
}

const mutations = {

    [types.RECEIVE_PROFILE](state, {
        jwt,
        profile,
        err,
        save
    }) {
        state.error = err;
        state.profile = profile;
        if (save) {
            if (jwt) {
                Vue.cookie.set('jwt', jwt, {
                    expires: '7D'
                });
            } else {
                Vue.cookie.delete('jwt');
            }
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}