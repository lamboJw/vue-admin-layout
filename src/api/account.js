import { get, post } from '@/utils/request'

// 新增管理员账号
export function addAccount(params = {}) {
  return post('/user/add', params)
}

// 删除管理员
export function delAccount(params = {}) {
  return post('/user/delete', params)
}

// 删除管理员
export function enableAccount(params = {}) {
  return post('/user/enableUser', params)
}

// 账号更新
export function updateAccount(params = {}) {
  return post('/user/update', params)
}

// 管理员列表
export function getAccount(params = {}) {
  return get('/user/list', params)
}

// 企业微信部门列表
export function getWXdepartment(params = {}) {
  return get('/work_wechat/department', params)
}

// 企业微信部门成员列表
export function getWXusers(params = {}) {
  return get('/work_wechat/user', params)
}

// 增加企业微信关联
export function addWXusers(params = {}) {
  return get('/user/wechat_map', params)
}

// 解除企业微信关联
export function delWXusers(params = {}) {
  return get('/user/wechat_unmap', params)
}

// 审批人
export function departmentUserTree(need_root = false) {
  return post('/work_wechat/departmentUserTree', { need_root: need_root ? 1 : 0 })
}
