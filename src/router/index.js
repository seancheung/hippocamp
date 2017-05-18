import Vue from 'vue';
import Router from 'vue-router';
import login from './login';
import register from './register';
import dashboard from './dashboard';

Vue.use(Router);

const router = new Router({
    routes: [login, register, dashboard]
});

Vue.use({
    install(Vue, options) {
        Vue.router = router;
    }
});

export default router;