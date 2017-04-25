import Router from 'vue-router';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Home from '../components/dashboard/Home';
import Orgnizations from '../components/dashboard/Orgnizations';
import Serials from '../components/dashboard/Serials';
import Settings from '../components/dashboard/Settings';
import Storages from '../components/dashboard/Storages';
import Users from '../components/dashboard/Users';
import store from '../store';

export default new Router({
    routes: [{
            path: '/login',
            name: 'Login',
            component: Login,
            beforeEnter: function (to, from, next) {
                if (!store.getters.authorized) {
                    next();
                } else {
                    next('/');
                }
            }
        },
        {
            path: '/',
            component: Dashboard,
            children: [{
                    path: '/',
                    name: 'Dashboard',
                    component: Home
                },
                {
                    path: '/serials',
                    name: 'Serials',
                    component: Serials
                },
                {
                    path: '/orgnizations',
                    name: 'Orgnizations',
                    component: Orgnizations
                },
                {
                    path: '/users',
                    name: 'Users',
                    component: Users
                },
                {
                    path: '/storages',
                    name: 'Storages',
                    component: Storages
                },
                {
                    path: '/settings',
                    name: 'Settings',
                    component: Settings
                }
            ],
            beforeEnter: function (to, from, next) {
                if (store.getters.authorized) {
                    next();
                } else {
                    next('/login');
                }
            }
        }
    ]
});