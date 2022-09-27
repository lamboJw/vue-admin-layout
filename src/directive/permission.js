import Vue from 'vue'
import store from '../store'

/**
 * VUE自定义权限指令
 * @author tjh
 * @desc 功能权限判断-可以移除和禁用 目前只启用移除
 * @use v-permission = "'action:add'"
 * @see https://cn.vuejs.org/v2/guide/custom-directive.html
 */
Vue.directive('permission', {
  inserted(el, binding) {
    const perms = store.getters.permissions
    if (perms && !perms.contains(binding.value)) {
      el.remove()
    }
  },
  update(el, binding) {
    const perms = store.getters.permissions
    if (perms && !perms.contains(binding.value)) {
      el.remove()
    }
  }
})

// eslint-disable-next-line no-extend-native
Array.prototype.contains = function(val) {
  return this.indexOf(val) !== -1
}
