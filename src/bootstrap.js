/**
 * This file is intended to load global Vue plugins
 */

import Vue from 'vue';
import Resource from 'vue-resource';
import Router from 'vue-router';
import Vuex from 'vuex';
import VueCookie from 'vue-cookie';
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic.js';

Vue.use(Resource);
Vue.use(Router);
Vue.use(Vuex);
Vue.use(VueCookie);

export default Vue;