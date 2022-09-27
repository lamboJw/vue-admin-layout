import { Message } from 'element-ui'

/**
 * 根据Date类型变量，返回格式化的日期时间，支持年、月、日、时、分、秒
 * @param {Date} date
 * @param {string} format
 * @returns {string}
 */
export function getDateTime(date, format = 'yyyy-MM-dd') {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return format.replace('yyyy', year).replace('MM', month).replace('dd', day)
    .replace('HH', hour).replace('mm', minute).replace('ss', second)
}

// 复制文本到剪贴板
export function copyToClipboard(textToCopy) {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    navigator.clipboard.writeText(textToCopy).then(() => {
      Message.success('复制成功')
    }).catch(() => {
      Message.error('复制失败')
    })
  } else {
    // 创建text area
    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = 'absolute'
    textArea.style.opacity = '0'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    new Promise((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    }).then(() => {
      Message.success('复制成功')
    }).catch(() => {
      Message.error('复制失败')
    })
  }
}

/**
 * 组装链接，根据链接特征选择组装域名
 * @param {string} url
 * @returns {string}
 */
export function combineUrl(url) {
  if (!url) return url
  if (url.indexOf('http') === 0) return url
  if (url.indexOf('static/') !== -1) {
    url = 'https://wx-hy.921.com/' + (url.indexOf('/') === 0 ? url.substr(1) : url)
  } else {
    url = process.env.VUE_APP_HOST + url
  }
  return url
}

/**
 * 八进制颜色值（#c9c9c9）转rgb颜色值
 * @param {string} hex
 * @returns {{r: number, b: number, g: number}|null}
 */
export function hexToRgb(hex) {
  // Hex（十六进制）、Dec（十进制）、Octal（八进制）、Bin（二进制）
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : hex
}

export function rgbToHex(rgb) {
  const result = /^rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\s?\)$/i.exec(rgb)
  if (result) {
    const r = (+result[1]).toString(16)
    const g = (+result[2]).toString(16)
    const b = (+result[3]).toString(16)
    return `#${r}${g}${b}`
  } else {
    return rgb
  }
}

/**
 * 获取从start到end的数组
 * @param {number} start 开始
 * @param {number|null} end 结束，如果不传该值，则生成从0开始到start的数组
 * @returns Array
 */
export function arrayRange(start, end = null) {
  if (end === null) {
    end = start
    start = 0
  }
  const length = end - start
  return Array.from({ length }, (_, index) => index + start)
}
