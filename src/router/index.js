import Vue from 'vue'
import Router from 'vue-router'
import test from '../pages/test.vue'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/test'
    },
    {
      path: '/test',
      component: test
    }
  ]
})