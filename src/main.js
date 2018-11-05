import '@babel/polyfill'
import Vue from 'vue'
import Element from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store';


import './common/common';
import './axios.config';

Vue.use(Element);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
