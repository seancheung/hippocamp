import Vue from 'vue';

import Resource from 'vue-resource';
Vue.use(Resource);

import Store from './store';
Vue.use(Store);

import router from './router';
import App from './App.vue';

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});