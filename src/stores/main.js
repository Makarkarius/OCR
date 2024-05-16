import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { deleteCookie, setCookie } from '@/misc'
import { handleApiError } from '@/errors'
import { documentTypes, userRoles } from '@/config'

export const useMainStore = defineStore('main', () => {
  class User {
    constructor() {
      this.init()
    }

    init() {
      this.id = ''
      this.email = ''
      this.name = ''
      this.surname = ''
      this.role = ''
      this.company = ''
    }

    fill(data) {
      if (!data) {
        console.log('failed to init user: payload is empty')
        return
      }

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
          this.fill(result.data)
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
          this.fill(result.data)
          setCookie('id', this.id, {
            'max-age': 3600 * 24 * 365,
            'same-site': 'strict'
          })
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
          handleApiError(err)
        })
    }

    async patch(data) {
      await axios.patch(
        '/api/v1/user/' + this.id,
        data,
        {
          withCredentials: true
        }
      ).then((result) => {
        this.fill(result.data)
      }).catch(err => {
        handleApiError(err)
      })
    }

    async patchPassword(oldPassword, newPassword) {
      await axios.patch(
        '/api/v1/user/' + this.id + ':change-password',
        {
          oldPassword: oldPassword,
          newPassword: newPassword
        },
        {
          withCredentials: true
        }
      ).then((result) => {
        this.fill(result.data)
      }).catch(err => {
        handleApiError(err)
      })
    }

    async delete() {
      await axios
        .delete(
          '/api/v1/user/' + this.id,
          {
            withCredentials: true
          }
        ).catch(err => {
          handleApiError(err)
        })
    }
  }

  class Model {
    constructor() {
      this.reset()
    }

    reset() {
      this.id = ''
      this.createdAt = ''
      this.name = ''
      this.description = ''
      this.documents = []
      this.participants = []
      this.previewURL = ''
      this.userRole = ''
      this.totalDocuments = 0
      this.datasetDocuments = 0
      this.labeledDocuments = 0
      this.isTemplateLabeled = false
    }

    fill(data) {
      if (!data) {
        console.log('failed to init model: data is empty')
        return
      }

      if (data.userRole) {
        this.userRole = data.userRole
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
      if (data.document) {
        this.documents = data.document
      }
      if (data.participants) {
        this.participants = data.participants
      }
      if (data.totalDocuments) {
        this.totalDocuments = data.totalDocuments
      }
      if (data.datasetDocuments) {
        this.datasetDocuments = data.datasetDocuments
      }
      if (data.labeledDocuments) {
        this.labeledDocuments = data.labeledDocuments
      }
      if (data.isTemplateLabeled) {
        this.isTemplateLabeled = data.isTemplateLabeled
      }
    }

    getPreviewURL() {
      if (!this.documents || this.documents.length === 0) {
        throw new Error('failed to get preview: model documents are empty')
      }

      const template = this.documents.find((d) => {
        return d.type === documentTypes.template
      })

      if (template) {
        return template.id
      }
      throw new Error('model does not have a template document')
    }

    getUser(id) {
      let needed = (id ? id : user.value.id)
      this.participants.forEach((participant) => {
        if (participant.id === needed) {
          return participant
        }
      })
      return undefined
    }

    async extract() {
      await axios
        .post('api/v1/project/' + this.id + ':execute',
          null,
          {
            withCredentials: true
          }
        ).catch((err) => {
          handleApiError(err)
        })
    }

    processMarkup(data) {
      if (data.length === 0) {
        throw new Error('No data!')
      }

      const header = [
        'id',
        'labels',
        'isLearnt',
        'isValid',
        'isLabeled',
        'type',
        'url',
        'createdAt'
      ].join(';') + '\n'

      let rows = data.split('\n')
      rows = rows.map((row) => {
        let cells = row.split('\t')
        return cells.join(';')
      })
      return header + rows.join('\n')
    }

    async getMarkup() {
      try {
        const response = await axios.get(
          'api/v1/project/' + this.id + '/markup',
          {
            withCredentials: true
          }
        )

        return this.processMarkup(response.data)
      } catch (err) {
        handleApiError(err)
      }
    }

    async getMarkupFree() {
      try {
        const response = await axios.get(
          'api/v1/project/' + this.id + '/markup-free',
          {
            withCredentials: true
          }
        )

        return this.processMarkup(response.data)
      } catch (err) {
        handleApiError(err)
      }
    }

    async fetch(id) {
      let requestedID = (id ? id : this.id)
      await axios
        .get('api/v1/project/' + requestedID,
          {
            withCredentials: true
          }
        ).then((response) => {
          this.fill(response.data)
        }).catch((err) => {
          handleApiError(err)
        })
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

        this.fill(response.data)
      } catch (err) {
        handleApiError(err)
      }
    }

    async patch(data) {
      const participants = data.participants.map((user) => {
        return {
          userId: user.id,
          role: userRoles.assessor
        }
      })

      if (participants.length > 0) {
        await axios.patch(
          'api/v1/project/' + this.id,
          {
            participants: participants
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        ).catch((err) => {
          handleApiError(err)
        })
      }

      await this.fetch()
    }

    async addDocuments(documents, type) {
      if (!documents || documents.length === 0) {
        return
      }

      const request = JSON.stringify({
        type: type
      })

      const blob = new Blob([request], {
        type: 'application/json'
      })

      const formData = new FormData()
      for (let i in documents) {
        formData.append('documents', documents[i])
      }
      formData.append('request', blob)


      await axios.post(
        'api/v1/project/' + this.id + ':upload-documents',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      ).catch((err) => {
        handleApiError(err)
      })
    }

    async delete() {
      await axios
        .delete('api/v1/project/' + this.id, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        .then(() => {
          this.reset()
        })
        .catch((err) => {
          handleApiError(err)
        })
    }
  }

  class ModelAnalytics {
    constructor() {
      this.reset()
    }

    reset() {
      this.id = ''
      this.name = ''
      this.documents = []
      this.participants = []
    }

    fill(data) {
      if (!data) {
        console.log('failed to init model analytics: data is empty')
        return
      }

      if (data.id) {
        this.id = data.id
      }
      if (data.name) {
        this.name = data.name
      }
      if (data.documents) {
        this.documents = data.documents
      }
      if (data.participants) {
        this.participants = data.participants
      }
    }

    async fetch(id) {
      await axios
        .get(
          'api/v1/project/' + id + ':analyze',
          {
            withCredentials: true
          }
        ).then((response) => {
          this.fill(response.data)
        }).catch((err) => {
          handleApiError(err)
        })
    }
  }

  class Document {
    constructor() {
      this.init()
    }

    init() {
      this.id = ''
      this.labels = []
      this.templateLabels = []
      this.type = ''
      this.urlPath = ''
      this.createdAt = ''
      this.assessors = []
      this.isValid = false
      this.isLearnt = false
      this.isLabeled = false
      this.projectId = ''
    }

    reset() {
      this.init()
    }

    fill(data) {
      if (!data) {
        console.log('failed to init document: data is empty')
        return
      }

      this.reset()

      if (data.id) {
        this.id = data.id
      }
      if (data.labels) {
        this.labels = data.labels
      }
      if (data.templateLabels) {
        this.templateLabels = data.templateLabels
      }
      if (data.type) {
        this.type = data.type
      }
      if (data.urlPath) {
        this.urlPath = data.urlPath
      }
      if (data.createdAt) {
        this.createdAt = data.createdAt
      }
      if (data.assessors) {
        this.assessors = data.assessors
      }
      if (data.isValid) {
        this.isValid = data.isValid
      }
      if (data.isLearnt) {
        this.isLearnt = data.isLearnt
      }
      if (data.isLabeled) {
        this.isLabeled = data.isLabeled
      }
      if (data.labeled) {
        this.isLabeled = data.labeled
      }
      if (data.projectId) {
        this.projectId = data.projectId
      }
    }

    getAssessor() {
      if (this.assessors && this.assessors.length > 0) {
        return this.assessors[0]
      }
    }

    async fetch(id) {
      await axios
        .get(
          'api/v1/document/' + id,
          {
            withCredentials: true
          }
        ).then((response) => {
          this.fill(response.data)
        }).catch((err) => {
          handleApiError(err)
        })
    }

    async patch(data) {
      axios
        .patch('api/v1/document/' + this.id,
          data,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })
        .then((result) => {
          this.fill(result.data)
        })
        .catch((err) => {
          handleApiError(err)
        })
    }

    async patchValid(id, valid) {
      axios
        .patch('api/v1/document/' + id,
          {
            isValid: valid
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })
        .catch((err) => {
          handleApiError(err)
        })
    }
  }

  const isFieldFocusRegistered = ref(false)

  const user = ref(new User())
  const users = ref([])

  const model = ref(new Model())
  const models = ref([])
  const modelAnalytics = ref(new ModelAnalytics())

  const document = ref(new Document())

  async function fetchUsers() {
    await axios
      .get('/api/v1/user?company=' + user.value.company, {
        withCredentials: true
      })
      .then((result) => {
        users.value = []
        result.data.forEach((user) => {
          const newUser = new User()
          newUser.fill(user)

          users.value.push(newUser)
        })
      })
      .catch((err) => {
        handleApiError(err)
      })
  }

  async function fetchAllUsers() {
    await axios
      .get('/api/v1/user/all', {
        withCredentials: true
      })
      .then((result) => {
        users.value = []
        result.data.forEach((user) => {
          const newUser = new User()
          newUser.fill(user)

          users.value.push(newUser)
        })
      })
      .catch((err) => {
        handleApiError(err)
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
          newModel.fill(model)

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
    users,
    models,
    model,
    modelAnalytics,
    document,
    fetchUsers,
    fetchAllUsers,
    fetchModels
  }
})
