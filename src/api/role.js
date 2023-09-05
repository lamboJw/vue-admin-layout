import { get, post } from '@/utils/request'

export function getRoleAll(params) {
  return post('/roles/all', params)
}

export function getRoleList(params) {
  return post('/roles/list', params)
}

export function getPermissions() {
  return get('/permissions/list')
}

export function roleInfo(params) {
  return post('/roles/info', params)
}

export function addRole(params) {
  return post('/roles/add', params)
}

export function updRole(params) {
  return post('/roles/update', params)
}

export function delRole(params) {
  return post('/roles/delete', params)
}
