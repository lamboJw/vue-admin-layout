import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'vue_login',
    method: 'get',
    params: data
  })
}

export function getInfo() {
  return request({
    url: 'role/user_roles',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'vue_logout',
    method: 'get'
  })
}
