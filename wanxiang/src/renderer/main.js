import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import request from './utils/request'
import baseConfig from './utils/baseConfig'

import baseFunction from './utils/baseFunction'

import filters from './utils/filters';
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

Vue.prototype.$request = request;

Vue.prototype.$baseFunction = baseFunction;
Vue.prototype.$baseConfig = baseConfig;

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
