import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { deleteCookie, setCookie } from '@/globals'
import { handleApiError } from '@/errors'

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

      setCookie('id', this.id, {
        'max-age': 3600 * 24 * 365,
        'same-site': 'strict'
      })
    }

    reset() {
      this.id = ''
      this.email = ''
      this.name = ''
      this.surname = ''
      this.role = ''
      this.company = ''

      deleteCookie('id')
    }

    async fetch(uid) {
      if (!uid) {
        return
      }

      await axios
        .get(
          '/api/v1/user/' + uid,
          {
            withCredentials: true
          }
        )
        .then((result) => {
          this.init(result)
        })
        .catch((err) => {
          handleApiError(err)
        })
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
        .catch((err) => {
          if (err.response.status === 400) {
            throw new Error('Invalid login or password')
          }
          handleApiError(err)
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
        .then(async () => {
          await this.login(email, password, company)
        })
        .catch(err => {
          // console.log('fuckk')
          handleApiError(err)
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
    constructor() {
      this.id = ''
      this.createdAt = ''

      this.name = ''
      this.description = ''
      this.documents = []
      this.participants = []
      this.previewURL = ''
      this.userRole = ''
    }

    init(payload) {
      if (!payload.data) {
        console.log('failed to init model: payload is empty')
        return
      }

      const data = payload.data

      if (data.userRole) {
        this.role = data.userRole
      }
      if (data.id) {
        this.id = data.id
      }
      if (data.name) {
        this.name = data.name
      }
      if (data.description) {
        this.description = data.description
      }
      if (data.createdAt) {
        this.createdAt = data.createdAt
      }
      if (data.previewURL) {
        this.previewURL = data.previewURL
      }
      if (data.documents) {
        this.documents = data.documents
      }
      if (data.participants) {
        this.participants = data.participants
      }
    }

    async create() {
      try {
        const response = await axios.post(
          'api/v1/project',
          {
            name: this.name,
            description: this.description,
            participants: this.participants
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        )

        this.id = response?.data?.id

        // await addDocument(form.rawReferenceDocument)
        //
        // for (let i = 0; i < form.rawOtherDocuments.length; i++) {
        //   await addDocument(form.rawOtherDocuments[i])
        // }
      } catch (err) {
        handleApiError(err)
      }
    }
  }

  const isFieldFocusRegistered = ref(false)

  const user = ref(new User())
  const clients = ref([])
  const users = ref([])
  const history = ref([])
  const models = ref([])

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
        withCredentials: true
      })
      .then((result) => {
        users.value = result?.data
      })
      .catch((err) => {
        handleApiError(err)
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
        withCredentials: true
      })
      .then((result) => {
        models.value = []
        if (!result.data || result.data.length === 0) {
          return
        }

        result.data.forEach((model) => {
          const newModel = new Model()
          newModel.init(model)

          models.value.push(newModel)
        })
      })
      .catch((error) => {
        handleApiError(error)
      })
  }

  return {
    user,
    isFieldFocusRegistered,
    clients,
    users,
    history,
    models,
    fetchSampleClients,
    fetchUsers,
    fetchSampleHistory,
    fetchSampleModels,
    fetchModels
  }
})
