import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { SERVER_URL } from '@/globals.js'

export const useMainStore = defineStore('main', () => {
  class User {
    constructor() {
      this.token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYWthcjEyNTJAbWFpbC5ydSIsImlhdCI6MTcxMzYxOTg1NCwiZXhwIjoxNzEzNjIzNDU0LCJjdXJyZW50VXNlciI6IntcInBhc3N3b3JkXCI6XCIkMmEkMTAkNmhzbW1VdzFSZDlJOEMyMDhYQ0w2ZWZpekZWYnBKLk1BRWRVMVZKZm5EdXZJUU8zcnZMNG1cIixcImF1dGhvcml0aWVzXCI6W3tcImF1dGhvcml0eVwiOlwiUk9MRV9VU0VSXCJ9XSxcImVuYWJsZWRcIjp0cnVlLFwiYWNjb3VudE5vbkxvY2tlZFwiOnRydWUsXCJhY2NvdW50Tm9uRXhwaXJlZFwiOnRydWUsXCJjcmVkZW50aWFsc05vbkV4cGlyZWRcIjp0cnVlLFwidXNlcm5hbWVcIjpcIm1ha2FyMTI1MkBtYWlsLnJ1XCJ9In0.Wp4qC0h7nXYQWwtLn4Q-s7VDHS0T_iAWRF3zi8u2e9wepl83V5bX08-ILLE9lAxVMZLMjXqevo1vUHNkEqq3eA'
      this.type = ''
      this.id = 'd227c6b9-eeb0-4ec8-80ec-8862638b900f'
      this.email = ''
      this.name = 'unauthorized'
      this.surname = ''
      this.company = ''
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
    // if (payload.email) {
    //   user.value.email = payload.email
    // }
    if (payload.token) {
      user.value.token = payload.token
    }
    if (payload.avatarURL) {
      user.value.avatarURL = payload.avatarURL
    }
    if (payload.id) {
      user.value.id = payload.id
    }
    console.log(payload)
  }

  function resetUser() {
    user.value.token = ''
    user.value.type = ''
    user.value.id = ''
    user.value.email = ''
    user.value.name = ''
    user.value.surname = ''
    user.value.company = ''
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

  function fetchModels() {
    axios
      .get(SERVER_URL + '/v1/project?userId=' + user.value.id)
      .then((result) => {
        realModels.value = result?.data
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
    fetchSampleModels,
    fetchModels
  }
})
