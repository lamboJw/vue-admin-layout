import { get, post } from '@/utils/request'
import { common } from '@/const/constant'

export function list() {
  return get('permissions/list')
}

export function del(id, recursion) {
  return get('permissions/delete', { id, recursion })
}

export function save(id, data) {
  if (id) {
    return post('permissions/update', data)
  } else {
    return post('permissions/add', data)
  }
}

export function info(id) {
  if (!id) {
    return common.empty_return
  }
  return get('permissions/info', { id })
}
