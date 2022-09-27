import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'role/listData',
    method: 'get',
    params
  })
}

export function del(id) {
  return request({
    url: 'role/delete',
    method: 'delete',
    params: { id }
  })
}
