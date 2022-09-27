import request from '@/utils/request'

export function getHomeInfo() {
  return request({
    url: 'home',
    method: 'get'
  })
}
