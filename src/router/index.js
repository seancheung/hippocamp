import Router from 'vue-router';
import Hello from '../components/Hello';
import Login from '../components/Login';

export default new Router({
    routes: [{
        path: '/',
        name: 'Hello',
        component: Hello
    }, {
        path: '/login',
        name: 'Login',
        component: Login
    }]
});