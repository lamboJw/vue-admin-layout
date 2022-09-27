export const route_map = {
  // 异步路由对应的页面，因为使用的是异步加载组件方式，所以只能用这种方法来获取组件
  'admin/index': () => import('@/views/admin/index'),
  'permission/index': () => import('@/views/permission/index'),
  'role/index': () => import('@/views/role/index'),
  'white_ip/index': () => import('@/views/white_ip/index')
}
