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

function damerauLevenshtein(a, b) {
  const len1 = a.length
  const len2 = b.length
  let result = 0

  const weights = {
    insert: .8,
    delete: 1.1,
    replace: 2
  }

  if (len1 === 0 || len2 === 0) {
    result += weights.insert * (len1)
    result += weights.delete * (len2)
    return result
  }

  const column = [0]

  for (let i = 1; i <= len2; i++) {
    column[i] = column[i - 1] + weights.insert
  }

  for (let i = 1; i <= len1; i++) {
    let last = column[0]
    column[0] += weights.delete
    for (let j = 1; j <= len2; j++) {
      const old = column[j]
      if (a[i - 1] === b[j - 1]) {
        column[j] = last
      } else {
        const ic = column[j - 1] + weights.insert
        const dc = column[j] + weights.delete
        const rc = last + weights.replace
        column[j] = ic < dc ? ic : (dc < rc ? dc : rc)
      }
      last = old
    }
  }

  result = column[len2]
  return result
}

export {
  isAuthorized,
  isPDF,
  getCookie,
  setCookie,
  deleteCookie,
  getDocumentURL,
  damerauLevenshtein
}
