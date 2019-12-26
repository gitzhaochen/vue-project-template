import Vue from 'vue'
// import Element from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import './axios.config'
//加载自定义组件
import { zgLogo, zgNotify } from 'allen-ui'
Vue.use(zgLogo)
Vue.prototype.$notify = zgNotify

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
