import Vue from 'vue';
import Resource from 'vue-resource';
import Router from 'vue-router';
import Store from './store';

Vue.use(Store);
Vue.use(Resource);
Vue.use(Router);

import App from './App.vue';
import router from './router';

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});