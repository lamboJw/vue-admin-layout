import request from '@/utils/request'

export function getPermission() {
  return request({
    url: 'permission/data',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: 'permission/delete',
    method: 'delete',
    data: { id }
  })
}
