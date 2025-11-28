import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router'

import { PATH } from './path'

const routes: RouteRecordRaw[] = [
  {
    path: PATH.HOME,
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: PATH.AUTH,
    name: 'Auth',
    component: () => import('@/views/AuthPage.vue'),
  },

  {
    path: PATH.LIST,
    name: 'List',
    component: () => import('@/views/ListPage.vue'),
  },
  {
    path: PATH.STATISTIC,
    name: 'Statistic',
    component: () => import('@/views/StatisticPage.vue'),
  },
  {
    path: PATH.QUESTIONS,
    name: 'Question',
    component: () => import('@/views/QuestionPage.vue'),
  },
  {
    path: PATH.VIDEO,
    name: 'Video',
    component: () => import('@/views/VideoPage.vue'),
  },
  {
    path: PATH.INTERVIEW,
    name: 'Interview',
    component: () => import('@/views/InterviewPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.path === PATH.AUTH) {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) next(PATH.HOME)
        else next()
      })
      return
    }

    onAuthStateChanged(getAuth(), (user) => {
      if (user) next()
      else next(PATH.AUTH)
    })
  },
)

export default router
