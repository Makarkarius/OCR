const containerMaxW = 'xl:max-w-8xl xl:mx-auto'

const SERVER_URL = 'http://192.168.100.113:8080'

const userRoles = {
  assessor: 'ROLE_ASSESSOR',
  manager: 'ROLE_MANAGER'
}

const documentTypes = {
  template: 'TEMPLATE', // template document labeled by manager
  dataset: 'DATASET',   // document for model training labeled by assessors
  free: 'FREE'          // document for data extraction
}

const templatePlaceholderURL = 'https://gas-kvas.com/uploads/posts/2023-02/1676277770_gas-kvas-com-p-pasport-risunok-raskraska-16.jpg'

export {
  containerMaxW,

  SERVER_URL,

  userRoles,
  documentTypes,

  templatePlaceholderURL
}
