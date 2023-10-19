'use strict'

const { isOrdinaryObject } = require('./utils.js')

const apply = (obj, diff) => {
  for (const key in diff) {
    if (isOrdinaryObject(diff[key])) {
      if (!isOrdinaryObject(obj[key])) obj[key] = {}
      apply(obj[key], diff[key])
    } else obj[key] = diff[key]
  }
}

module.exports = apply
