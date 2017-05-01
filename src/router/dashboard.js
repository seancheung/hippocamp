import Dashboard from '../components/Dashboard';
import Home from '../components/dashboard/Home';
import Orgnizations from '../components/dashboard/Orgnizations';
import Serials from '../components/dashboard/Serials';
import Settings from '../components/dashboard/Settings';
import Storages from '../components/dashboard/Storages';
import Users from '../components/dashboard/Users';
import store from '../store';

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
            name: 'Storages',
            path: '/storages',
            component: Storages
        },
        {
            name: 'Settings',
            path: '/settings',
            component: Settings
        }
    ],
    beforeEnter: function (to, from, next) {
        if (store.getters.profile) {
            next();
        } else {
            next({
                name: 'Login'
            });
        }
    }
}