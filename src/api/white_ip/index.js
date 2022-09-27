import request from '@/utils/request'

export function getInfo() {
  return request({
    url: 'white_ip',
    method: 'get'
  })
}

export function addIp(ip, remark) {
  return request({
    url: 'white_ip/add_ip',
    method: 'get',
    params: { ip, remark }
  })
}

export function delIp(ip) {
  return request({
    url: 'white_ip/del_ip',
    method: 'get',
    params: { ip }
  })
}
