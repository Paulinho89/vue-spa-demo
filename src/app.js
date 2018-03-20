import Vue from 'vue';

Vue.config.debug = process.env.NODE_ENV !== 'production';

/* ============
 * Vuex Router Sync
 * ============
 *
 * https://github.com/vuejs/vuex-router-sync/blob/master/README.md
 *
 * 主要是把vue-router的状态放在vuex的state中，这样就可以通过改变state的状态来进行路由的操作
 */
import VuexRouterSync from 'vuex-router-sync';

import store from './store';

import router from './routers';

VuexRouterSync.sync(store, router);

import 'babel-polyfill';

// 引入公共样式
import '@/styles/index.less';
