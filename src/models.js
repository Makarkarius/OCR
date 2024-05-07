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

export {
  Document,
  Model
}
