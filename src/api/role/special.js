import request from '@/utils/request'

export function getInfo(id) {
  return request({
    url: 'role/rolegcview/' + id,
    method: 'get'
  })
}

export function saveGame(id, data) {
  return request({
    url: 'role/rolegame/' + id,
    method: 'patch',
    data
  })
}

export function saveChannel(id, data) {
  return request({
    url: 'role/rolechannel/' + id,
    method: 'patch',
    data
  })
}

export function checkIp(id, check_ip) {
  return request({
    url: 'role/roleCheckIp/' + id,
    method: 'get',
    params: { check_ip }
  })
}

export function saveIp(id, ip, type) {
  return request({
    url: 'role/roleIpStore/' + id,
    method: 'get',
    params: { ip, type }
  })
}
