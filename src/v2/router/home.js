import Vue from 'vue';
import Home from '../components/Home';
import Account from '../components/Account';
import AccountEdit from '../components/AccountEdit';
import Orgnizations from '../components/Orgnizations';
import OrgnizationAdd from '../components/OrgnizationAdd';
import Orgnization from '../components/Orgnization';
import OrgnizationEdit from '../components/OrgnizationEdit';
import Users from '../components/Users';
import UserAdd from '../components/UserAdd';
import User from '../components/User';
import UserEdit from '../components/UserEdit';
import Serials from '../components/Serials';
import SerialAdd from '../components/SerialAdd';
import Storage from '../components/Storage';

export default {
    path: '/',
    component: Home,
    children: [{
        name: 'Account',
        path: '/',
        component: Account
    }, {
        name: 'AccountEdit',
        path: '/edit',
        component: AccountEdit
    }, {
        name: 'Orgnizations',
        path: '/orgs',
        component: Orgnizations
    },{
        name: 'OrgnizationAdd',
        path: '/orgs/add',
        component: OrgnizationAdd
    }, {
        name: 'Orgnization',
        path: '/orgs/:id',
        component: Orgnization
    }, {
        name: 'OrgnizationEdit',
        path: '/orgs/:id/edit',
        component: OrgnizationEdit
    }, {
        name: 'Users',
        path: '/orgs/:id/users',
        component: Users,
    }, {
        name: 'UserAdd',
        path: '/orgs/:id/users/add',
        component: UserAdd
    }, {
        name: 'User',
        path: '/users/:id',
        component: User
    }, {
        name: 'UserEdit',
        path: '/users/:id/edit',
        component: UserEdit
    }, {
        name: 'Serials',
        path: '/orgs/:id/serials',
        component: Serials
    }, {
        name: 'SerialAdd',
        path: '/orgs/:id/serials/add',
        component: SerialAdd
    }, {
        name: 'Storage',
        path: 'users/:id/storage',
        component: Storage
    }],
    beforeEnter: (to, from, next) => {
        if (Vue.store.getters.profile) {
            next();
        } else {
            Vue.store.dispatch('redirect', {
                path: to.path
            });
            next({
                name: 'Login'
            });
        }
    }
}