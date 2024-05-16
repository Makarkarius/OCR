import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Labeler from '@/views/LabelerView.vue'
import Model from '@/views/ModelView.vue'

const routes = [
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Models'
    },
    path: '/models',
    name: 'models',
    component: () => import('@/views/ModelsView.vue')
  },
  {
    meta: {
      title: 'Labeler'
    },
    path: '/labeler/:id',
    name: 'labeler',
    component: Labeler
  },
  {
    meta: {
      title: 'Model'
    },
    path: '/models/:id',
    name: 'model',
    component: Model
  },
  {
    meta: {
      title: 'Model creation'
    },
    path: '/models/new',
    name: 'model creation',
    component: () => import('@/views/ModelCreationView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.addRoute({ path: '/labeler', component: Labeler })
router.replace(router.currentRoute.value.fullPath)

export default router
