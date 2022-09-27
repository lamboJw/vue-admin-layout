import request from '@/utils/request'

export function getInfo(id) {
  if (!id) {
    return new Promise((resolve, reject) => {
      resolve({ code: 200, data: [] })
    })
  }
  return request({
    url: 'permission/edit/' + id,
    method: 'get'
  })
}

export function save(id, data) {
  if (id !== 0) {
    return request({
      url: 'permission/edit/' + id,
      method: 'patch',
      data
    })
  } else {
    return request({
      url: 'permission/add',
      method: 'post',
      data
    })
  }
}
