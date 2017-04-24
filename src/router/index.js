import Router from 'vue-router';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import store from '../store';

export default new Router({
    routes: [{
            path: '/login',
            name: 'Login',
            component: Login,
            beforeEnter: function (to, from, next) {
                if (!store.getters.authed) {
                    next();
                } else {
                    next('/');
                }
            }
        },
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard,
            beforeEnter: function (to, from, next) {
                if (store.getters.authed) {
                    next();
                } else {
                    next('/login');
                }
            }
        }
    ]
});