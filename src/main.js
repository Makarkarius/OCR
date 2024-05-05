import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main.js'

import axios from 'axios'

import { getCookie, isAuthorized } from '@/globals'
import { UnauthorizedError } from '@/errors'

import './css/main.css'

// Init Pinia
const pinia = createPinia()

// Set axios network errors handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error('Network error:', error)
    }
    return Promise.reject(error)
  }
)

// Create Vue app
const app = createApp(App).use(router).use(pinia)

// Init main store
const mainStore = useMainStore(pinia)

// Fetch sample data
mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()
mainStore.fetchSampleModels()

try {
  const uid = getCookie('id')
  await mainStore.user.fetch(uid)
} catch (e) {
  if (e instanceof UnauthorizedError) {
    console.log('unauthorized')
  } else {
    console.log(e)
  }
}

app.mount('#app')

// Default title tag
const defaultDocumentTitle = 'OCR'

// Set document title from route meta
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})

router.beforeEach((to) => {
  if (!isAuthorized(mainStore.user) && to.name !== 'login') {
    return '/login'
  }
})
