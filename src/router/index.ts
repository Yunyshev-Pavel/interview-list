import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router'

import { PATH } from './path'
const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  let isAuth = false
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      isAuth = true
      next()
    } else if (!user && !isAuth) {
      next('/auth')
    }
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: PATH.Home,
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: PATH.Auth,
    name: 'Auth',
    component: () => import('@/views/AuthPage.vue'),
  },
  {
    path: PATH.Interview,
    name: 'Interview',
    component: () => import('@/views/InterviewPage.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: PATH.List,
    name: 'List',
    component: () => import('@/views/ListPage.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: PATH.Statistic,
    name: 'Statistic',
    component: () => import('@/views/StatisticPage.vue'),
    beforeEnter: checkAuth,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
