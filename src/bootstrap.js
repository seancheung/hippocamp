/**
 * This file is intended to load global Vue plugins
 */

import Vue from 'vue';
import Bootstrap from 'bootstrap-vue';
import Resource from 'vue-resource';
import Router from 'vue-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(Bootstrap);
Vue.use(Resource);
Vue.use(Router);

export default Vue;