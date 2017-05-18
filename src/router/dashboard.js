import Dashboard from '../components/Dashboard';
import Home from '../components/dashboard/Home';
import Orgnizations from '../components/dashboard/Orgnizations';
import Serials from '../components/dashboard/Serials';
import Settings from '../components/dashboard/Settings';
import Storage from '../components/dashboard/Storage';
import Users from '../components/dashboard/Users';
import Vue from 'vue';

export default {
    path: '/',
    component: Dashboard,
    children: [{
            name: 'Dashboard',
            path: '/',
            component: Home
        },
        {
            name: 'Serials',
            path: '/serials',
            component: Serials
        },
        {
            name: 'Orgnizations',
            path: '/orgnizations',
            component: Orgnizations
        },
        {
            name: 'Users',
            path: '/users',
            component: Users
        },
        {
            name: 'Storage',
            path: '/storage',
            component: Storage
        },
        {
            name: 'Settings',
            path: '/settings',
            component: Settings
        }
    ],
    beforeEnter: function (to, from, next) {
        if (Vue.store.getters.profile) {
            next();
        } else {
            Vue.store.dispatch('redirect', {
                name: to.name
            });
            next({
                name: 'Login'
            });
        }
    }
}