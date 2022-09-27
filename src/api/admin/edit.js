import request from '@/utils/request'

export function getInfo(id) {
  if (!id) {
    return new Promise((resolve, reject) => {
      resolve({ code: 200, data: [] })
    })
  }
  return request({
    url: 'admin/edit/' + id,
    method: 'get'
  })
}

export function save(id, data) {
  if (id !== 0) {
    return request({
      url: 'admin/edit/' + id,
      method: 'patch',
      data
    })
  } else {
    delete data.password
    delete data.password_confirmation
    return request({
      url: 'admin/add',
      method: 'post',
      data
    })
  }
}
