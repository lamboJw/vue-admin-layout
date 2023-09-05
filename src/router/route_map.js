export const route_map = {
  // 异步路由对应的页面，因为使用的是异步加载组件方式，所以只能用这种方法来获取组件
  '/account': () => import('@/views/account/index'),
  '/permission': () => import('@/views/permission/index'),
  '/role': () => import('@/views/role/index'),
  '/log': () => import('@/views/log/index')
}
