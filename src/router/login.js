import Login from '../components/Login';
import Vue from 'vue';

export default {
    name: 'Login',
    path: '/login',
    component: Login,
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