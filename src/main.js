import Vue from 'vue';
import App from './App.vue';

require('./app.js');

const app = new Vue(App).$mount('#app');
export default app;
