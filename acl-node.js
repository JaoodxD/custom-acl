'use strict';

const validator = {
  get(target, key) {
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], validator);
    } else {
      return target[key];
    }
  }
};


module.exports = class ACLNode {
  name;
  #config;
  #mergeLogic;
  #diffLogic;
  #children;
  constructor(config, name = 'anonymous node', mergeLogic, diffLogic) {
    this.#config = config;
    this.#mergeLogic = mergeLogic;
    this.#diffLogic = diffLogic;
    this.name = name;
    this.#children = [];
  }

  appendChildren(node) {
    this.#children.push(node);
  }

  update(newConfig) {
    let config;
    let cfg = this.#diffLogic ? this.#diffLogic(this.#config, newConfig) : this.#config;
    if (this.#mergeLogic) config = this.#mergeLogic(cfg, newConfig);
    else config = newConfig;
    this.#config = config;
    console.log('Config updated in', this.name);
    this.updateChilderen(cfg);
  }

  get config() {
    return this.#config;
  }

  set config(value) {
    this.#config = value;
    this.updateChilderen();
  }

  updateChilderen(cfg) {
    for (const child of this.#children) {
      if (!child) continue;
      if (!child.update) continue;
      child.update(cfg);
    }
  }
}
