import Register from '../components/Register';
import Vue from 'vue';

export default {
    name: 'Register',
    path: '/register',
    component: Register,
    beforeEnter: function (to, from, next) {
        if (!Vue.store.getters.profile) {
            next();
        } else {
            next({
                name: 'Dashboard'
            });
        }
    }
}