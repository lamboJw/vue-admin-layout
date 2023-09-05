import { get } from '@/utils/request'

// 部门列表
export function getDepartment(params = {}) {
  return get('/department/list', params)
}
