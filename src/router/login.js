import Login from '../components/Login';
import store from '../store';

export default {
    name: 'Login',
    path: '/login',
    component: Login,
    beforeEnter: function (to, from, next) {
        if (!store.getters.profile) {
            next();
        } else {
            next({
                name: 'Dashboard'
            });
        }
    }
}