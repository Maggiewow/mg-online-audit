/*
 * @Author: your name
 * @Date: 2020-07-23 09:48:43
 * @LastEditTime: 2022-05-17 16:29:35
 * @LastEditors: 赵婷婷
 * @Description: In User Settings Edit
 * @FilePath: \sucai-modal\src\main.js
 */

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import config from '@/config';

// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

// import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
// Vue.use(ViewUI);

import ZkTable from 'vue-table-with-tree-grid';
Vue.use(ZkTable);

import Es6Promise from 'es6-promise';
require('es6-promise').polyfill();
Es6Promise.polyfill();

import { Message, Modal } from 'view-design';
Vue.config.productionTip = false;
Vue.prototype.$config = config;
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
