import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 获取登录token
  const hasToken = getToken()

  if (hasToken) {
    store.commit('user/SET_CSRF_TOKEN', hasToken)
    if (to.path === '/login') {
      // 如果已经登录，又打开登录页面，自动跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断用户是否已经获取角色信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取角色信息
          // 注意：角色信息必须是一个数组对象，例如['admin']或[1, 2]
          const roles = await store.dispatch('user/getInfo')
          // 根据角色权限创建路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          accessRoutes.push({ path: '*', redirect: '/404', hidden: true })
          // 动态添加路由
          router.addRoutes(accessRoutes)

          // 将replace设置为true，确保不会保留历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 获取角色信息失败，清除token记录，跳转到登录页面
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token记录 */

    if (whiteList.indexOf(to.path) !== -1) {
      // 页面在无需登录白名单中，直接打开
      next()
    } else {
      // 其他页面需要登录，跳转到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
