import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: 'common/permission',
    method: 'get'
  })
}

export function getTodoNum() {
  return request({
    url: 'get_todo_num',
    method: 'get'
  })
}
