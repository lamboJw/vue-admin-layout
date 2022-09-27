import { constantRoutes } from '@/router'
import { getRoutes } from '@/api/common/permission'
import Layout from '@/layout'
import { route_map } from '@/router/route_map'
import { notify_list, notify_path } from '@/store/modules/notify_list'

/**
 * 判断角色是否拥有该路由的权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role.toString()))
  } else {
    return true
  }
}

export function getAsyncRoutes(routes) {
  const res = []
  const keys = ['path', 'name', 'children', 'redirect', 'alwaysShow', 'meta', 'hidden']
  routes.forEach(item => {
    const newItem = {}
    if (item.component) { // 获取路由对应的组件
      if (item.component === 'Layout') { // 布局，一般为一级菜单
        newItem.component = Layout
      } else { // 根据后端返回的路径，去对照表获取对应的异步加载组件
        newItem.component = route_map[item.component]
      }
    }
    for (const key in item) {
      if (keys.includes(key)) {
        newItem[key] = item[key]
      }
    }
    if (typeof newItem.meta !== 'undefined') { // 添加菜单提醒数字
      newItem.meta.notify_num = 0
    }
    if (newItem.children && newItem.children.length) { // 子菜单组装路由
      newItem.children = getAsyncRoutes(item.children)
    }
    res.push(newItem)
  })
  return res
}

/**
 * 根据角色权限过滤路由
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  let permissions = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      // eslint-disable-next-line no-prototype-builtins
      if (tmp.hasOwnProperty('meta') && tmp.meta.hasOwnProperty('permissions')) {
        permissions = permissions.concat(tmp.meta.permissions)
      }
      if (tmp.children) {
        const children = filterAsyncRoutes(tmp.children, roles)
        tmp.children = children.res
        permissions = permissions.concat(children.permissions)
      }
      res.push(tmp)
    }
  })

  return { res, permissions }
}

const state = {
  routes: [],
  addRoutes: [],
  permissions: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes) // 合并静态路由和动态路由
  },
  UPDATE_NOTIFY_NUM: (state, payload) => { // 更新菜单提醒数字
    state.routes.forEach(function(route) {
      if (typeof route.children !== 'undefined' && route.children.length > 0) {
        route.meta.notify_num = 0
        route.children.forEach(function(child) {
          if (notify_path.includes(child.path)) { // 找到二级菜单，修改提醒数
            child.meta.notify_num = payload[notify_list[child.path]]
            route.meta.notify_num += payload[notify_list[child.path]] // 增加一级菜单提醒数
          }
        })
      }
    })
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      // 异步获取路由
      getRoutes().then(asyncRoutes => {
        // 组装路由信息
        asyncRoutes = getAsyncRoutes(asyncRoutes)
        // 根据角色权限过滤路由
        const result = filterAsyncRoutes(asyncRoutes, roles)
        const accessedRoutes = result.res
        commit('SET_PERMISSIONS', result.permissions)
        // 这里因为项目会根据角色显示不同首页，所以在这里写首页的路由，如果没有这个需要，可以由接口返回
        const index_route = {
          path: '/',
          component: Layout,
          redirect: '/index',
          name: '/0',
          meta: { breadcrumb: false },
          children: [{
            path: 'index',
            name: 'index',
            component: () => import('@/views/home/index'),
            meta: { title: '首页', icon: 'dashboard' }
          }]
        }
        if (roles.includes(1)) { // 角色包含1，就显示首页2
          index_route.children[0].component = () => import('@/views/home/index2')
        }
        accessedRoutes.unshift(index_route)
        // 保存路由信息
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateNotifyNum({ commit }, notify_num) {
    return new Promise((resolve, reject) => {
      commit('UPDATE_NOTIFY_NUM', notify_num)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
