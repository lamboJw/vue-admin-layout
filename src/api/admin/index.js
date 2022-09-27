import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'admin/listData',
    method: 'get',
    params
  })
}

export function del(id) {
  return request({
    url: 'admin/delete',
    method: 'delete',
    params: { id }
  })
}
