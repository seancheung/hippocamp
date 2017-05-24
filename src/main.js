import Vue from 'vue';

import Resource from 'vue-resource';
Vue.use(Resource);

import Store from './v2/store';
Vue.use(Store);

import components from './v2/components';
Vue.use(components);

import router from './v2/router';
import App from './App.vue';

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});