import Vue from 'vue';
import Router from 'vue-router';
import login from './login';
import home from './home';

Vue.use(Router);

const router = new Router({
    routes: [login, home]
});

Vue.use({
    install(Vue, options) {
        Vue.router = router;
    }
});

export default router;