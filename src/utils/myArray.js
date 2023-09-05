import { MyObject } from '@/utils/myObject'
import { math } from '@/utils/math'

class MyArray extends Array {
  constructor(arr = []) {
    if (arr === null || arr === undefined) arr = []
    if (!Array.isArray(arr)) {
      throw new Error('MyArray：传入参数不是数组')
    }
    super(...arr)
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
   * 查找对象数组中，key元素为val值的对象在数组中的下标
   * @param key
   * @param val
   * @returns {number}
   */
  findObjectIndex(key, val) {
    return this.findIndex((item) => item[key] === val)
  }

  /**
   * 对象数组，根据指定field_name,field_val，获取到对象在数组中的下标，然后设置对象中key的val值
   * @param field_name
   * @param field_val
   * @param key
   * @param val
   */
  setObjectFieldValue(field_name, field_val, key, val) {
    const index = this.findObjectIndex(field_name, field_val)
    if (this[index].hasKey(key)) {
      this[index][key] =
        typeof val === 'object'
          ? val instanceof Array
            ? new MyArray(val)
            : new MyObject(val)
          : val
    }
  }

  /**
   * 克隆一个新数组
   * @returns {MyArray}
   */
  clone() {
    return new MyArray([...this])
  }

  /**
   * 返回一个元素唯一的数组
   * @returns {MyArray}
   */
  unique() {
    return new MyArray([...new Set(this)])
  }

  /**
   * 数组求和
   */
  sum() {
    return this.reduce((acc, cur) => {
      return math.add(math.bignumber(acc), math.bignumber(cur))
    })
  }
}

export { MyArray }
