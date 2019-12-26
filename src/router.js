import Vue from 'vue'
import Router from 'vue-router'

const notfound = () => import(/* webpackChunkName: "notfound" */ './views/notfound/notfound.vue')
const home = () => import(/* webpackChunkName: "home" */ './views/home/home.vue')

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/404',
      name: 'notfound',
      component: notfound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
export default router
