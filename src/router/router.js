import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: "/panel/home",
      name: "Home",
      component: () => import("@/dashboard/dashboard.vue")
    }
  ]
})