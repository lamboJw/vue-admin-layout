import { get, post } from '@/utils/request'
import { common } from '@/const/constant'

export function list(params) {
  return post('xxx/list', params)
}

export function info(id) {
  if (!id) {
    return common.empty_return
  }
  return get('xxx/info', { id })
}

export function save(id, data) {
  if (id) {
    return post('xxx/update', data)
  } else {
    return post('xxx/add', data)
  }
}

export function del(id) {
  return get('xxx/delete', { id })
}
