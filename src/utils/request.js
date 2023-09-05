import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) { // 每个请求都带上token值用于验证登录
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + store.getters.token
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
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
  (response) => {
    if (response.status === 401) {
      unauth('登录信息已过期，请重新登录')
      return Promise.reject(new Error('登录信息已过期，请重新登录'))
    }
    const res = response.data
    if (res.code !== 0) {
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
  },
  (error) => {
    const { response } = error
    console.error(response.data.data.error)
    if (response) {
      if (response.status === 401) {
        unauth('登录已过期')
      } else {
        // 请求已发出，但是不在0的范围
        errorHandle(response.data.code, response.data.msg)
        return Promise.reject(response)
      }
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false)
      } else {
        return Promise.reject(error)
      }
    }
    if (response.status === 401) {
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
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    })
  }).catch(() => {
  })
}

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = (msg) => {
  Message({
    message: msg,
    duration: 1000 * 5,
    type: 'error'
  })
}

// eslint-disable-next-line no-unused-vars
const notify = (msg) => {
  Message({
    message: msg,
    duration: 5000,
    type: 'warning'
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param msg
 */
const errorHandle = (status, msg) => {
  // 状态码判断
  switch (status) {
    // 100: 请求参数有误
    case 400:
      tip(msg)
      // toLogin();
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 101:
      unauth('无权限查看')
      break
    // 404请求不存在
    case 401:
    case 100003:
    case 100004:
    case 100005:
    case 100006:
      unauth(msg)
      break
    case 404:
      tip(msg)
      break
    default:
      tip(msg)
      console.log('other', msg)
  }
}

const get = (url, params = {}) => {
  return service.get(url, { params })
}

const post = (url, params = {}) => {
  return service.post(url, JSON.stringify(params), {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

const uploadFile = (url, rawFile) => {
  var forms = new FormData()
  forms.append('file', rawFile)
  return service.post(url, forms, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export { get, post, uploadFile }
