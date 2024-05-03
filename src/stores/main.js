import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {

  class User {
    constructor() {
      this.id = ''
      this.email = ''
      this.name = ''
      this.surname = ''
      this.role = ''
      this.company = ''
    }

    init(payload) {
      if (!payload.data) {
        console.log('failed to init user: payload is empty')
        return
      }
      const data = payload.data
      if (data.id) {
        this.id = data.id
      }
      if (data.email) {
        this.email = data.email
      }
      if (data.name) {
        this.name = data.name
      }
      if (data.surname) {
        this.surname = data.surname
      }
      if (data.role) {
        this.role = data.role
      }
      if (data.company) {
        this.company = data.company
      }
    }

    async login(email, password, company) {
      await axios
        .post(
          '/api/security/login',
          {
            email: email,
            password: password,
            company: company
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then((result) => {
          this.init(result)
        })
        .catch((error) => {
          if (error.response) {
            throw new Error(error.response.data?.errors[0]?.message)
          } else if (error.request) {
            console.log(error.request)
          } else {
            console.log('Error', error.message)
          }
        })
    }

    async register(name, surname, email, password, company) {
      await axios
        .post(
          '/api/security/register',
          {
            name: name,
            surname: surname,
            email: email,
            password: password,
            company: company
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(() => {
          this.login(email, password, company)
        })
        .catch((error) => {
          if (error.response) {
            throw new Error(error.response.data?.errors[0]?.message)
          } else if (error.request) {
            console.log(error.request)
          } else {
            console.log('Error', error.message)
          }
        })
    }
  }

  class Document {
    constructor(id, labels, type, urlPath, createdAt, assessors, valid, learnt, labeled) {
      this.id = id
      this.labels = labels
      this.type = type
      this.urlPath = urlPath
      this.createdAt = createdAt
      this.assessors = assessors
      this.valid = valid
      this.learnt = learnt
      this.labeled = labeled
    }
  }

  class Model {
    constructor(data = {
      id: '',
      name: '',
      description: '',
      createdAt: '',
      documents: [],
      participants: []
    }) {
      this.id = data?.id
      this.name = data?.name
      this.description = data?.description
      this.createdAt = data?.createdAt
      this.documents = data?.documents
      this.participants = data?.participants
    }
  }

  const user = ref(new User())

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const users = ref([])
  const history = ref([])
  const models = ref([])
  const realModels = ref([])

  function setUser(payload) {
    if (payload.id) {
      user.value.id = payload.id
    }
    if (payload.email) {
      user.value.email = payload.email
    }
    if (payload.name) {
      user.value.name = payload.name
    }
    if (payload.surname) {
      user.value.name = payload.surname
    }
    if (payload.role) {
      user.value.name = payload.role
    }
    if (payload.token) {
      user.value.token = payload.token
    }
    if (payload.avatarURL) {
      user.value.avatarURL = payload.avatarURL
    }
    if (payload.company) {
      user.value.company = payload.company
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
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  }

  async function fetchUsers() {
    await axios
      .get('/api/v1/user?company=' + user.value.company, {
        headers: {
          'Authorization': user.value.token
        }
      })
      .then((result) => {
        users.value = result?.data
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  }

  function fetchSampleModels() {
    axios
      .get(`data-sources/models.json?v=3`)
      .then((result) => {
        models.value = result?.data?.data
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  }

  async function fetchModels() {
    await axios
      .get('/api/v1/project?userId=' + user.value.id, {
        headers: {
          'Authorization': user.value.token
        },
        withCredentials: true
      })
      .then((result) => {
        realModels.value = result?.data
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  }

  return {
    user,
    isFieldFocusRegistered,
    clients,
    users,
    history,
    models,
    realModels,
    setUser,
    resetUser,
    fetchSampleClients,
    fetchUsers,
    fetchSampleHistory,
    fetchSampleModels,
    fetchModels
  }
})
