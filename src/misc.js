import { templatePlaceholderURL } from '@/config'

function isAuthorized(user) {
  return user.email.length > 0
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  }

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey
    let optionValue = options[optionKey]
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue
    }
  }

  document.cookie = updatedCookie
}

const isPDF = (url) => {
  if (!url) {
    return false
  }
  const tokens = url.split('.')
  return tokens[tokens.length - 1] === 'pdf'
}

function deleteCookie(name) {
  setCookie(name, '', {
    'max-age': -1
  })
}

function getDocumentURL(document) {
  if (!document || document?.name === 'placeholder') {
    return templatePlaceholderURL
  }
  return URL.createObjectURL(document)
}

export {
  isAuthorized,
  isPDF,
  getCookie,
  setCookie,
  deleteCookie,
  getDocumentURL
}
