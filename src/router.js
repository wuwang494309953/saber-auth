import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Main from '@/components/main/Main'
import User from '@/components/user/User'
import Role from '@/components/role/Role'
import Acl from '@/components/acl/Acl'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/user',
          alias: '/',
          name: 'user',
          component: User
        },
        {
          path: '/role',
          name: 'role',
          component: Role
        },
        {
          path: '/acl',
          name: 'acl',
          component: Acl
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
