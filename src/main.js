import Vue from 'vue';
import Resource from 'vue-resource';
import Router from 'vue-router';

Vue.use(Resource);
Vue.use(Router);

import App from './App.vue';
import store from './store';
import router from './router';

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
});