import Cookies from 'js-cookie'

// 记录登录token的cookie key
const TokenKey = 'hy-sdk-backend-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
