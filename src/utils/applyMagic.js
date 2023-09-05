function checkType(constructor, fn, name, argLength) {
  if (fn !== undefined) {
    if (typeof fn !== 'function') {
      throw new TypeError(
        `Magic method ${constructor.name}.${name} must be defined as a function`
      )
    } else if (argLength !== undefined && fn.length !== argLength) {
      throw new SyntaxError(
        `Magic method ${
          constructor.name
        }.${name} must have ${argLength} parameter${argLength === 1 ? '' : 's'}`
      )
    }
  }
}

// eslint-disable-next-line no-unused-vars
function setProp(target, prop, value, writable) {
  Object.defineProperty(target, prop, {
    configurable: true,
    enumerable: false,
    writable: !!writable,
    value: value
  })
}

export function applyMagic(constructor) {
  function PsudoClass(...args) {
    if (typeof this === 'undefined') {
      // function call
      const invoke = constructor.prototype.__invoke
      checkType(constructor, invoke, '__invoke')
      return invoke ? invoke(...args) : constructor(...args)
    } else {
      Object.assign(this, new constructor(...args))
      const get = this.__get
      const set = this.__set
      const has = this.__has
      const _delete = this.__delete
      checkType(new.target, get, '__get', 1)
      checkType(new.target, set, '__set', 2)
      checkType(new.target, has, '__has', 1)
      checkType(new.target, _delete, '__delete', 1)

      return new Proxy(this, {
        get: (target, prop) => {
          return get ? get.call(target, prop) : target[prop]
        },
        set: (target, prop, value) => {
          set ? set.call(target, prop, value) : (target[prop] = value)
          return true
        },
        has: (target, prop) => {
          return has ? has.call(target, prop) : prop in target
        },
        deleteProperty: (target, prop) => {
          _delete ? _delete.call(target, prop) : delete target[prop]
          return true
        }
      })
    }
  }

  Object.setPrototypeOf(PsudoClass.prototype, constructor.prototype)
  Object.setPrototypeOf(PsudoClass, constructor)

  setProp(PsudoClass, 'name', constructor.name)
  setProp(PsudoClass, 'length', constructor.length)
  setProp(
    PsudoClass,
    'toString',
    function toString() {
      const target = this === PsudoClass ? constructor : this
      return Function.prototype.toString.call(target)
    },
    true
  )
  return PsudoClass
}

export function applyMagic2(constructor) {
  function PsudoClass(...args) {
    if (typeof this === 'undefined') {
      // function call
      const invoke = constructor.prototype.__invoke
      checkType(constructor, invoke, '__invoke')
      return invoke ? invoke(...args) : constructor(...args)
    } else {
      const instance = new constructor(...args)
      const get = instance.__get
      const set = instance.__set
      const has = instance.__has
      const _delete = instance.__delete
      checkType(constructor, get, '__get', 1)
      checkType(constructor, set, '__set', 2)
      checkType(constructor, has, '__has', 1)
      checkType(constructor, _delete, '__delete', 1)

      return new Proxy(instance, {
        get: (target, prop) => {
          return get ? get.call(target, prop) : target[prop]
        },
        set: (target, prop, value) => {
          set ? set.call(target, prop, value) : (target[prop] = value)
          return true
        },
        has: (target, prop) => {
          return has ? has.call(target, prop) : prop in target
        },
        deleteProperty: (target, prop) => {
          _delete ? _delete.call(target, prop) : delete target[prop]
          return true
        }
      })
    }
  }

  return PsudoClass
}
