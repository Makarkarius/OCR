export function isAuthentificated(user) {
  return user.token.length > 0
}

export const SERVER_URL = 'http://192.168.100.113:8080'
