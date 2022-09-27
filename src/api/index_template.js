import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'material/data',
    method: 'get',
    params
  })
}

export function getOptions() {
  return request({
    url: 'material/index',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: 'material/del',
    method: 'get',
    params: { id }
  })
}

export function changeStatus(id, status) {
  return request({
    url: 'material/changeStatus',
    method: 'get',
    params: { id, status }
  })
}
