import Vue from 'vue'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

import NProgress from 'nprogress'

Vue.use(Element, { size: 'small' })
NProgress.configure({ showSpinner: false, speed: 2000 })

Vue.prototype.$NProgress = NProgress
Vue.prototype.BASE_URL = process.env.VUE_APP_BASE_API
Vue.prototype.SOCKET_URL = process.env.VUE_APP_SOCKET_URL
Vue.prototype.UPLOAD_URL = process.env.VUE_APP_BASE_API + '/upload/index'

// 注册公用组件
const component = require.context('@/components', true, /index\.vue$/)
component
  .keys()
  .map(component)
  .forEach(({ default: item }) => {
    Vue.component(item.name, item)
  })
