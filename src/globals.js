const SERVER_URL = 'http://192.168.100.113:8080'

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

function deleteCookie(name) {
  setCookie(name, '', {
    'max-age': -1
  })
}

export {
  SERVER_URL,
  isAuthorized,
  getCookie,
  setCookie,
  deleteCookie
}
