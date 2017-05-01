import Register from '../components/Register';
import store from '../store';

export default {
    name: 'Register',
    path: '/register',
    component: Register,
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