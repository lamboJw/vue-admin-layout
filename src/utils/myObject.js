import { MyArray } from '@/utils/myArray'

class MyObject {
  constructor(obj = {}) {
    if (obj === null || obj === undefined) obj = {}
    Object.assign(this, obj)
    for (const k in this) {
      if (typeof this[k] === 'object' && this[k] !== null) {
        if (!Array.isArray(this[k]) && !(this[k] instanceof MyObject)) {
          this[k] = new MyObject(this[k])
        } else if (Array.isArray(this[k]) && !(this[k] instanceof MyArray)) {
          this[k] = new MyArray(this[k])
        }
      }
    }
  }

  /**
   * 对象key=>value转成数组形式
   * @param key key对应的数组key
   * @param value value对应的数组key
   * @returns {*[]}
   */
  toArray(key = 'id', value = 'name') {
    const arr = []
    for (const i in this) {
      arr.push({ [key]: i, [value]: this[i] })
    }
    return arr
  }

  /**
   * 对象中是否存在key
   * @param key
   * @returns {boolean}
   */
  hasKey(key) {
    return !!Object.getOwnPropertyDescriptor(this, key)
  }

  /**
   * 获取对象中的属性，如属性不存在，返回默认值
   * @param key 属性key值
   * @param default_val 默认值
   * @returns {*|null}
   */
  getAttr(key, default_val = null) {
    return this.hasKey(key) ? this[key] : default_val
  }

  /**
   * 获取对象中属性的数量
   * @returns {number}
   */
  length() {
    return this.keys().length
  }

  /**
   * 条件过滤对象
   * @param filter 过滤条件方法，传值有对象的key和val
   * @returns {MyObject}
   */
  filter(filter) {
    return new MyObject(
      Object.fromEntries(
        Object.entries(this).filter(([key, val]) => filter(key, val))
      )
    )
  }

  /**
   * 返回对象的所有键
   * @returns {string[]}
   */
  keys() {
    return Object.keys(this)
  }

  /**
   * 返回对象的所有值
   * @returns {unknown[]}
   */
  values() {
    return Object.values(this)
  }

  /**
   * 遍历对象
   * @param callback
   */
  forEach(callback) {
    this.keys().forEach((key) => {
      callback(this[key], key)
    })
  }

  /**
   * 克隆一个新对象
   * @returns {MyObject}
   */
  clone() {
    const new_obj = Object.assign({}, this)
    return new MyObject(new_obj)
  }

  /**
   * 反转key和value
   * @returns {{}}
   */
  invertKeyValues() {
    return Object.keys(this).reduce((acc, key) => {
      acc[this[key]] = key
      return acc
    }, {})
  }

  /**
   * 判断值是否为真
   * @param key
   * @returns {false|*}
   */
  isTrue(key) {
    return this.hasKey(key) && this[key]
  }
}

Object.setPrototypeOf(Array.prototype, MyObject.prototype)

export { MyObject }
