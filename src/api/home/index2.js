import request from '@/utils/request'

export function getHomeInfo() {
  return request({
    url: 'home2',
    method: 'get'
  })
}
export function getOverview(params) {
  return request({
    url: 'overview',
    method: 'get',
    params
  })
}

export function getTop5(params) {
  return request({
    url: 'top5',
    method: 'get',
    params
  })
}
export function getLineChart(params) {
  return request({
    url: 'line_chart',
    method: 'get',
    params
  })
}
