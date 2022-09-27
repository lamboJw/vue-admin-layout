import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.csrf_token) { // 每个请求都带上token值用于验证登录
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-CSRF-TOKEN'] = store.getters.csrf_token
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    config.headers['VUE-REQUEST'] = 1 // 添加额外信息用来判断是否为vue前端，后端如果只有一个前端，可以不写
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status === 401) {
      unauth('登录信息已过期，请重新登录')
      return Promise.reject(new Error('登录信息已过期，请重新登录'))
    }
    const res = response.data
    // 按照后端返回的接口接口来判断响应内容
    if (typeof res.code !== 'undefined') {
      if (res.code !== 200) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          dangerouslyUseHTMLString: true,
          duration: 5 * 1000
        })
        if (res.code === 401) {
          unauth(res.message)
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    } else if (typeof res.ret !== 'undefined') {
      if (res.ret !== 1) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          dangerouslyUseHTMLString: true,
          showClose: true,
          duration: 5 * 1000
        })
        if (res.ret === 401) {
          unauth(res.msg)
        }
        return Promise.reject(new Error(res.msg || 'Error'))
      } else {
        return res.content
      }
    } else {
      return res
    }
  },
  error => {
    if (error.response.status === 401) {
      unauth('登录已过期')
    } else {
      Message({
        message: error.response.data.message,
        type: 'error',
        dangerouslyUseHTMLString: true,
        showClose: true,
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

function unauth(msg) {
  MessageBox.confirm(msg, '权限不足', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  }).catch(() => {})
}

export default service
