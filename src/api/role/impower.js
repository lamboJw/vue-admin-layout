import request from '@/utils/request'

export function getInfo(id) {
  return request({
    url: 'role/impower/data/' + id,
    method: 'get'
  })
}

export function save(id, data) {
  return request({
    url: 'role/impower/' + id,
    method: 'patch',
    data
  })
}
