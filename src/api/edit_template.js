import request from '@/utils/request'

export function getInfo(id) {
  return request({
    url: 'material/edit',
    method: 'get',
    params: { id }
  })
}

export function save(id, data) {
  return request({
    url: 'material/store/' + id,
    method: 'post',
    data
  })
}
