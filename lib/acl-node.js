'use strict'

const { copy } = require('./utils.js')

const DEFAULT = {
  MERGE: require('./applyDiffs.js'),
  DIFF: require('./diffObjects.js')
}

const validator = {
  get (target, key) {
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], validator)
    } else {
      return target[key]
    }
  }
}

module.exports = class AclNode {
  name
  parent
  #config
  #colorDot
  #children
  #merge
  #diff
  constructor ({ config, name, merge, diff }) {
    this.#config = config ?? {}
    this.name = name ?? 'anonymous node'
    this.#merge = merge ?? DEFAULT.MERGE
    this.#diff = diff ?? DEFAULT.DIFF
    this.#children = []
  }

  setParent (node) {
    this.parent = node
  }

  appendChildren (node) {
    node.setParent(this)
    this.#children.push(node)
  }

  removeChild (node) {
    this.#children = this.#children.filter((child) => child !== node)
  }

  update (newConfig) {
    const cfg = this.#diff ? this.#diff(this.#config, newConfig) : newConfig
    if (this.#merge) this.#merge(this.#config, cfg)
    else this.#config = cfg
    this.updateChilderen(cfg)
    if (this.#onUpdate) this.#onUpdate(this.#config)
  }

  recalcColorDot () {

  }

  get config () {
    return this.#config
  }

  set config (value) {
    this.#config = value
    this.updateChilderen()
  }

  updateChilderen (cfg) {
    for (const child of this.#children) {
      if (!child) continue
      if (!child.update) continue
      child.update(cfg)
    }
  }
}
