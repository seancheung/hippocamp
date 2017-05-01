import Router from 'vue-router';
import login from './login';
import register from './register';
import dashboard from './dashboard';

export default new Router({
    routes: [login, register, dashboard]
});