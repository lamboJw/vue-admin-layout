import request from '@/utils/request'

export function save(id, data) {
  return request({
    url: 'admin/editpwd/' + id,
    method: 'patch',
    data
  })
}
