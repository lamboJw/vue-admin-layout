import Cookies from 'js-cookie'

// 记录登录token的cookie key
const TokenKey = 'Admin-Token'
const UidKey = 'Admin-Uid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUid() {
  return Cookies.get(UidKey)
}

export function setUid(uid) {
  return Cookies.set(UidKey, uid, { expires: 1 })
}

export function removeUid() {
  return Cookies.remove(UidKey)
}
