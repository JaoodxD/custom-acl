'use strict'

const { isOrdinaryObject, isPrimitive } = require('./utils.js')

const diff = (obj1, obj2) => {
  if (isPrimitive(obj1) && isPrimitive(obj2)) {
    return obj2
  }

  const { time: t1 = 0 } = obj1
  const { time: t2 = 0 } = obj2

  const newObj = {}

  const keys = new Set(Object.keys(obj1).concat(Object.keys(obj2)))

  for (const key of keys) {
    const v1 = obj1[key]
    const v2 = obj2[key]
    if (v1 === v2) continue
    if (t1 === t2) {
      if (isOrdinaryObject(v1) && isOrdinaryObject(v2)) {
        const diffValue = diff(v1, v2)
        if (diffValue !== undefined) newObj[key] = diffValue
      } else if (v2 !== undefined) {
        newObj[key] = v2
      }
    }
    if (t1 < t2) newObj[key] = v2
  }
  if (!Object.keys(newObj).length) return
  return newObj
}

module.exports = diff
