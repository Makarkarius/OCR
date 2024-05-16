import { createRouter, createWebHashHistory } from 'vue-router'
import Labeler from '@/views/LabelerView.vue'
import Model from '@/views/ModelView.vue'
import ModelAnalytics from '@/views/ModelAnalyticsView.vue'
import Analytics from '@/views/AnalyticsView.vue'
import Models from '@/views/ModelsView.vue'
import ModelCreation from '@/views/ModelCreationView.vue'
import Profile from '@/views/ProfileView.vue'
import Login from '@/views/LoginView.vue'
import Users from '@/views/UsersView.vue'

const routes = [
  {
    path: '/',
    redirect: '/models'
  },
  {
    meta: {
      title: 'Models'
    },
    path: '/models',
    name: 'models',
    component: Models
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
    component: ModelCreation
  },
  {
    meta: {
      title: 'Analytics'
    },
    path: '/analytics',
    name: 'analytics',
    component: Analytics
  },
  {
    meta: {
      title: 'Model analytics'
    },
    path: '/analytics/:id',
    name: 'model analytics',
    component: ModelAnalytics
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    meta: {
      title: 'Users'
    },
    path: '/users',
    name: 'users',
    component: Users
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.replace(router.currentRoute.value.fullPath)

export default router
