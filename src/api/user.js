import { get, post } from '@/utils/request'

export function login(params) {
  return post('/user/login', params)
}

export function singleLogin(params) {
  return post('/user/single_login', params)
}

export function workWechatLogin(params) {
  return post('/work_wechat/login', params)
}

export function getRole(params) {
  return post('/permissions/list', params)
}

export function info(params) {
  return post('/user/info', params)
}

export function logout() {
  return post('/user/logout')
}

export function getLog(params) {
  return post('/log/list', params)
}

export function reToken(params) {
  return post('/user/refresh', params)
}

export function getRoutes() {
  return get('user/getRoutes')
}
