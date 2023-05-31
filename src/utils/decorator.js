/**
 * 节流
 * @param wait {number}
 */
export const throttle = (wait = 200) => {
  return (target, name, descriptor) => {
    const fn = descriptor.value
    let canRun = true
    wait = wait || 200
    descriptor.value = function() {
      if (!canRun) return
      fn.apply(this, arguments)
      canRun = false
      setTimeout(() => {
        canRun = true
      }, wait)
    }
  }
}

/**
 * 防抖
 * @param wait
 */
export function debounce(wait) {
  return function(target, name, descriptor) {
    const fn = descriptor.value
    let timer = null
    wait = wait || 200
    descriptor.value = function() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, wait)
    }
  }
}

/**
 * 操作确认提醒
 * @param msg {string} 提示信息
 * @param title {string} 标题
 * @param options {Object} 提示选项
 * @returns {(function(*, *, *): void)|*}
 */
export function confirm_msg(msg = '确定要进行此操作吗？', title = '提示', options = {}) {
  return function(target, name, descriptor) {
    const fn = descriptor.value
    descriptor.value = function() {
      this.$confirm(msg, title, options)
        .then(() => {
          fn.apply(this, arguments)
        })
        .catch(() => {})
    }
  }
}

/**
 * 提醒且提交内容
 * @param msg {string} 提示信息
 * @param title {string} 标题
 * @param options {Object} 提示选项
 * @returns {(function(*, *, *): void)|*}
 */
export function prompt_msg(msg, title = '提示', options = {}) {
  return function(target, name, descriptor) {
    const fn = descriptor.value
    descriptor.value = function() {
      this.$prompt(msg, title, options)
        .then(({ value }) => {
          const args = [...arguments]
          args.push(value)
          fn.apply(this, args)
        })
        .catch(() => {})
    }
  }
}
