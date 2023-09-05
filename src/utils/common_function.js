import { Message } from 'element-ui'
import { saveAs } from 'file-saver'
import store from '@/store'
import { common } from '@/const/constant'

// 根据Date类型变量，返回格式化的日期时间，支持年、月、日、时、分、秒
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
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

// 获取某天的当前月的第一天
export function getDayMonthFirstDay(dateValue) {
  const date = new Date(dateValue)
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  const day = '01'
  month = month < 10 ? '0' + month : month
  return year + '-' + month + '-' + day
}

// 复制文本到剪贴板
export function copyToClipboard(textToCopy) {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        Message.success('复制成功')
      })
      .catch(() => {
        Message.error('复制失败')
      })
  } else {
    // 创建text area
    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = 'absolute'
    textArea.style.opacity = 0
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    new Promise((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
      .then(() => {
        Message.success('复制成功')
      })
      .catch(() => {
        Message.error('复制失败')
      })
  }
}

export function getFileSuffix(fileName) {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

export function combineUrl(url) {
  if (!url) return url
  if (url.indexOf('http') === 0) return url
  url = process.env.VUE_APP_BASE_API + url
  return url
}

export function diffMonths(startMonth, endMonth) {
  const m1 = startMonth.split('-')
  const sMonths = parseInt(m1[0]) * 12 + parseInt(m1[1])
  const m2 = endMonth.split('-')
  const eMonths = parseInt(m2[0]) * 12 + parseInt(m2[1])
  return Math.abs(sMonths - eMonths)
}

export function getTextWidth(text, fontSize) {
  // 创建临时元素
  const _span = document.createElement('span')
  // 放入文本
  _span.innerText = text
  // 设置文字大小
  _span.style.fontSize = fontSize + 'px'
  // span元素转块级
  _span.style.position = 'absolute'
  // span放入body中
  document.body.appendChild(_span)
  // 获取span的宽度
  const width = _span.offsetWidth
  // 从body中删除该span
  document.body.removeChild(_span)
  // 返回span宽度
  return width
}

/**
 * 获取从start到end的数组
 * @param start 开始
 * @param end 结束，如果不传该值，则生成从0开始到start的数组
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

export const downloadUrl = (url, name = '') => {
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      let fileName = ''
      if (name === '' || name === undefined) {
        fileName = url.split('/')[url.split('/').length - 1]
      } else {
        fileName = name
      }
      saveAs(blob, fileName)
    })
    .catch(err => {
      console.log(err)
    })
}

export function hexToRgb(hex) {
  // Hex（十六进制）、Dec（十进制）、Octal（八进制）、Bin（二进制）
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : null
}

/**
 * 对象key=>value转成数组形式
 * @param obj
 * @param key key对应的数组key
 * @param value value对应的数组key
 * @returns {*[]}
 */
export function objectToArray(obj, key = 'id', value = 'name') {
  const arr = []
  for (const i in obj) {
    arr.push({ [key]: i, [value]: obj[i] })
  }
  return arr
}

export function objectHasKey(obj, key) {
  return !!Object.getOwnPropertyDescriptor(obj, key)
}

export function objectGetValue(obj, key, default_val = null) {
  return objectHasKey(obj, key) ? obj[key] : default_val
}

export function objectLength(obj) {
  return Object.keys(obj).length
}

/**
 * 条件过滤对象
 * @param obj
 * @param filter 过滤条件方法，传值有对象的key和val
 * @returns Object
 */
export function objectFilter(obj, filter) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, val]) => filter(key, val))
  )
}

/**
 * 对象数组中根据key匹配val，获取该对象在数组中的下标
 * @param array 对象数组，[{...}, {...}]
 * @param key 对象中的某个key
 * @param val 要匹配的值
 * @returns Number 匹配到的下标
 */
export function objectArrayFindIndex(array, key, val) {
  return array?.findIndex((item) => item[key] === val)
}

export function getClientHeight() {
  let clientHeight
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  } else {
    clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  }
  return clientHeight
}

export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export function getWidth(width, unit = 'px') {
  if (isNumeric(width)) {
    return width + unit
  }
  return width
}

export function numberFormat(number, decimals = 0, thousands_sep = '') {
  if (number === null || number === '' || number === undefined || !isNumeric(number)) {
    return number
  }
  number = number + ''
  const arr = number.split('.')
  const negative = arr[0].indexOf('-') !== -1
  arr[0] = parseInt(arr[0]).toString()
  if (negative && arr[0] === '0') {
    arr[0] = '-' + arr[0]
  }
  if (typeof arr[1] === 'undefined') {
    arr[1] = ''
  }
  if (arr[1].length > decimals) {
    arr[1] = arr[1].slice(0, decimals)
  }
  number = decimals > 0 && number.indexOf('.') !== -1 ? arr.join('.') : arr[0]
  return thousands_sep !== '' ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep) : number.toString()
}

export function loadJs(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject()
    }
  })
}

export function loadCss(src) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = src
    document.body.appendChild(link)
    link.onload = () => {
      resolve()
    }
    link.onerror = () => {
      reject()
    }
  })
}

/**
 * 检查当前操作人
 * @param {string[] | number[] | number | string} operator 操作人uid数组
 * @param {boolean} admin 是否允许超管操作
 * @returns {boolean}
 */
export function checkOperator(operator, admin = false) {
  if (Array.isArray(operator)) {
    operator.map((item, index) => {
      operator[index] = item + ''
    })
  } else {
    operator = [operator + '']
  }
  const uid = store.getters.uid.toString()
  let auth = false
  if (operator.includes(uid)) {
    auth = true
  }
  if (admin && uid === common.admin_uid) {
    auth = true
  }
  return auth
}

export function getColor(color) {
  if (color[0] === '#') return color
  color = common.color.getAttr(color, color)
  return color
}

/**
 * 检查当前主体是否包含在数组中
 * @param {string[]} main_arr 主体数组
 * @returns {boolean}
 */
export function checkMain(main_arr = []) {
  const match = main_arr.filter((item) => {
    return process.env.VUE_APP_NAME === `CS_${item}`
  })
  return match.length > 0
}
