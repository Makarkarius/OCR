import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {
  class User {
    constructor() {
      this.name = 'unauthorized'
      this.email = ''
      this.token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWthcjEyNTJAbWFpbC5ydSIsImlhdCI6MTcxMzQ3OTY5MCwiZXhwIjoxNzEzNDgzMjkwLCJjdXJyZW50VXNlciI6IntcInBhc3N3b3JkXCI6XCIkMmEkMTAkVHVFdW1ucVZqbjR6NlM2NE8zSEJTZWFady5UZ2ltUjRqdHVNUGtrR0hGVVlvQlFlOGtPbG1cIixcImF1dGhvcml0aWVzXCI6W3tcImF1dGhvcml0eVwiOlwiUk9MRV9VU0VSXCJ9XSxcImVuYWJsZWRcIjp0cnVlLFwiYWNjb3VudE5vbkV4cGlyZWRcIjp0cnVlLFwiY3JlZGVudGlhbHNOb25FeHBpcmVkXCI6dHJ1ZSxcImFjY291bnROb25Mb2NrZWRcIjp0cnVlLFwidXNlcm5hbWVcIjpcIm1ha2FyMTI1MkBtYWlsLnJ1XCJ9In0.CgUL081sQ1TAJkdNUIx8GYw98-5Ilu7_ImEj6Wm-JNAuklOH79pIbrvSpZkdTYHf893mIVaHSOeiEww0ifoMbg'
      this.avatarURL = ''
    }
  }

  const user = ref(new User())

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])
  const models = ref([])
  const realModels = ref([])

  function setUser(payload) {
    if (payload.name) {
      user.value.name = payload.name
    }
    if (payload.email) {
      user.value.email = payload.email
    }
    if (payload.token) {
      user.value.token = payload.token
    }
    if (payload.avatarURL) {
      user.value.avatarURL = payload.avatarURL
    }
  }

  function resetUser() {
    user.value.name = ''
    user.value.email = ''
    user.value.token = ''
    user.value.avatarURL = ''
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleModels() {
    axios
      .get(`data-sources/models.json?v=3`)
      .then((result) => {
        models.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    user,
    isFieldFocusRegistered,
    clients,
    history,
    models,
    realModels,
    setUser,
    resetUser,
    fetchSampleClients,
    fetchSampleHistory,
    fetchSampleModels
  }
})
