'use strict'

const { copy } = require('./utils.js')

const RELATION_TYPE = {
  SUBSET: 'red',
  SUPERSET: 'blue',
  OVERLAPPING: 'red-blue',
  EQUAL: ''
}

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
  #onUpdate
  constructor (opts = {}) {
    this.#config = opts.config ?? {}
    this.name = opts.name ?? 'anonymous node'
    this.#merge = opts.merge ?? DEFAULT.MERGE
    this.#diff = opts.tsdiff ?? DEFAULT.DIFF
    this.#onUpdate = opts.onUpdate
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
    this.#children = this.#children.filter(child => child !== node)
  }

  update (newConfig) {
    const cfg = this.#diff ? this.#diff(this.#config, newConfig) : newConfig
    if (this.#merge) this.#merge(this.#config, cfg)
    else this.#config = cfg
    this.recalcDot()
    this.updateChilderen(cfg)
    if (this.#onUpdate) this.#onUpdate(this.config)
  }

  get dotColor () {
    return this.#colorDot
  }

  recalcDot () {
    this.#colorDot = this.calcRelation()
  }

  calcRelation () {
    const thisCfg = this.config
    if (!this.parent) return RELATION_TYPE.EQUAL
    const parentCfg = this.parent.config
    const diff = this.#diff(parentCfg, thisCfg)
    const stringified = JSON.stringify(diff)
    if (!stringified) return RELATION_TYPE.EQUAL
    const restricted = stringified.includes(':false')
    const extended = stringified.includes(':true')
    if (extended && restricted) return RELATION_TYPE.OVERLAPPING
    if (extended) return RELATION_TYPE.SUPERSET
    if (restricted) return RELATION_TYPE.SUBSET
    return RELATION_TYPE.EQUAL
  }

  get config () {
    return copy(this.#config)
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
