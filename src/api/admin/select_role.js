import request from '@/utils/request'

export function getUserRole(id) {
  return request({
    url: `admin/impower/role/${id}`,
    method: 'get'
  })
}

export function getUserGames(id) {
  return request({
    url: `admin/user_games`,
    method: 'get',
    params: { id }
  })
}

export function getUserChannels(id) {
  return request({
    url: `admin/user_channels`,
    method: 'get',
    params: { id }
  })
}

export function getAllRole() {
  return request({
    url: `admin/impower/data`,
    method: 'get'
  })
}

export function getRoleGames(role) {
  return request({
    url: `common/RoleGamesOptions`,
    method: 'get',
    params: { role }
  })
}

export function getRoleChannels(role) {
  return request({
    url: `common/RoleChannelOptions`,
    method: 'get',
    params: { role }
  })
}

export function save(id, data) {
  return request({
    url: 'admin/impower/' + id,
    method: 'patch',
    data
  })
}
