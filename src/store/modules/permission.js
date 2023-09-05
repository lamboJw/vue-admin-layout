import router, { constantRoutes } from '@/router'
import Layout from '@/layout'
import { route_map } from '@/router/route_map'
import { MyObject } from '@/utils/myObject'
import { getRoutes } from '@/api/user'
import { objectGetValue } from '@/utils/common_function'
import { getToken } from '@/utils/auth'

/**
 * 判断角色是否拥有该路由的权限
 * @param {MyObject} route
 */
function hasPermission(route) {
  if (route.hasKey('meta') && route.meta.hasKey('permission')) {
    return state.permissions.includes(route.meta.permission)
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
 */
export function filterAsyncRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = new MyObject(route)
    if (hasPermission(tmp)) {
      if (tmp.children) {
        const children = filterAsyncRoutes(tmp.children)
        tmp.children = children.res
      }
      res.push(tmp)
    }
  })

  return { res }
}

const getDefaultState = () => {
  return {
    routes: [],
    addRoutes: [],
    permissions: [],
    topRoutes: [],
    leftRoutes: {},
    curTopRoute: ''
  }
}

const state = getDefaultState()

function match_route(cur_route, route) {
  if (route.path === cur_route) {
    return true
  }
  if (typeof route.children !== 'undefined' && route.children.length > 0) {
    for (const i in route.children) {
      const ret = match_route(cur_route, route.children[i])
      if (ret) {
        return true
      }
    }
  } else {
    return false
  }
}

const mutations = {
  SET_ROUTES: (state, payload) => {
    const { routes, redirect_to } = payload
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes) // 合并静态路由和动态路由
    let redirect_top_route = null
    state.routes.map((item, k) => {
      if (!objectGetValue(item, 'hidden')) {
        state.topRoutes.push({ title: item.meta.title, name: item.name })
        state.leftRoutes[item.name] = item.children
      }
      if (match_route(redirect_to, item)) {
        redirect_top_route = item.name
      }
    })
    state.curTopRoute = redirect_top_route || (state.topRoutes.length > 0 ? state.topRoutes[0].name : '')
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_CUR_TOP_ROUTE: (state, cur_top_route) => {
    state.curTopRoute = cur_top_route
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  generateRoutes({ commit }, redirect_to = '') {
    return new Promise((resolve, reject) => {
      // 异步获取路由
      getRoutes().then(asyncRoutes => {
        // 组装路由信息，从后端获取的路由就是经过过滤的
        const accessedRoutes = getAsyncRoutes(asyncRoutes.result)
        // 保存路由信息
        commit('SET_ROUTES', { routes: accessedRoutes, redirect_to })
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  },
  selectTopRoute({ commit }, top_route) {
    return new Promise(() => {
      if (state.topRoutes.some((item) => item.name === top_route)) {
        commit('SET_CUR_TOP_ROUTE', top_route)
        if (router.currentRoute.path !== state.leftRoutes[top_route]['0'].path) {
          router.push(state.leftRoutes[top_route]['0'].path)
        }
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
