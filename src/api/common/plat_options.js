import request from '@/utils/request'

export function gameCodeOptions() {
  return request({
    url: 'common/gamecodeOptions',
    method: 'get'
  })
}
export function h5GameOptions(is_game_code = false) {
  return request({
    url: 'common/h5GameOptions',
    method: 'get',
    params: {
      is_game_code
    }
  })
}

export function channelOptions() {
  return request({
    url: 'common/channelOptions',
    method: 'get',
    params: { tree: 1 }
  })
}

export function entranceOptions(game_code) {
  return request({
    url: 'common/entranceOptions',
    method: 'get',
    params: { game_code }
  })
}

export function glzOptions(game_code, channel_id) {
  return request({
    url: 'common/glzOptions',
    method: 'get',
    params: { game_code, channel_id }
  })
}

export function scopeOptions() {
  return new Promise((resolve, reject) => {
    resolve(
      [
        { id: 'day', name: '按日统计', value: 'day' },
        { id: 'week', name: '按周统计', value: 'week' },
        { id: 'month', name: '按月统计', value: 'month' }
      ]
    )
  })
}

export function indexOptions() {
  return new Promise((resolve, reject) => {
    resolve(
      [
        { id: 'newreg', name: '新增用户', value: 'newreg' },
        { id: 'loginuid', name: '活跃用户', value: 'loginuid' },
        { id: 'pay', name: '付费金额', value: 'pay' },
        { id: 'pay_ratio', name: '付费率', value: 'pay_ratio' }
      ]
    )
  })
}

export function mchOptions() {
  return request({
    url: 'common/mchOptions',
    method: 'get'
  })
}

export function roleUsersOptions(roles) {
  if (typeof roles !== 'string') {
    roles = roles.join(',')
  }
  return request({
    url: 'common/roleUsersOptions',
    method: 'get',
    params: { roles }
  })
}
