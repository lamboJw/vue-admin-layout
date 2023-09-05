const getters = {
  sidebar: state => state.app.sidebar,
  size: (state) => state.app.size,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  device: state => state.app.device,
  token: state => state.user.token,
  uid: state => state.user.uid,
  name: state => state.user.name,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes,
  left_routes: state => state.permission.leftRoutes,
  top_routes: state => state.permission.topRoutes,
  cur_top_route: state => state.permission.curTopRoute,
  permissions: state => state.permission.permissions,
  ws: (state) => state.websocket.websocket
}
export default getters
