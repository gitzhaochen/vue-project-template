import '@babel/polyfill'
import Vue from 'vue'
import Element from 'element-ui'
import App from './App.vue'
import router from './router'


import './common/common';
import './axios.config';

Vue.use(Element);

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
